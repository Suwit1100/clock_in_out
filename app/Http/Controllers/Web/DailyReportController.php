<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\DailyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

use function PHPUnit\Framework\returnSelf;

class DailyReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('web/daily_report/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        try {
            $validator = Validator::make($request->all(), [
                'summary_text' => 'nullable|string',
                'tasks' => 'required|array|min:1',
                'tasks.*.task_type' => 'required|string',
                'tasks.*.project_name' => 'required|string',
            ], [
                'tasks.required' => 'กรุณาระบุรายการงานอย่างน้อย 1 รายการ',
                'tasks.*.task_type.required' => 'กรุณาระบุประเภทงาน',
                'tasks.*.project_name.required' => 'กรุณาระบุชื่อโปรเจกต์',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            DB::beginTransaction();

            $attendance = Attendance::where('user_id', Auth::id())
                ->whereDate('date', now()->toDateString())
                ->firstOrFail();

            //  ต้อง clock in ก่อนถึงจะเขียนได้
            if (!$attendance->clock_in_time) {
                return back()->withErrors(['message' => 'คุณต้องลงเวลาเข้า (Clock In) ก่อนจึงจะบันทึกรายงานได้']);
            }

            //  หากเคยสร้างรายงานแล้ว ให้ redirect ไปหน้าแก้ไขแทน
            if ($attendance->dailyReport) {
                return redirect()
                    ->route('daily-report.edit', $attendance->dailyReport->id)
                    ->with('success', 'คุณได้สร้างรายงานไว้แล้ว วันนี้สามารถแก้ไขได้');
            }

            $report = $attendance->dailyReport()->create([
                'summary_text' => $request->summary_text,
            ]);

            foreach ($request->tasks as $task) {
                $report->tasks()->create([
                    'task_type' => $task['task_type'],
                    'project_name' => $task['project_name'],
                ]);
            }

            DB::commit();

            return redirect()
                ->route('daily-report.edit', $report->id)
                ->with('success', 'บันทึกรายงานเรียบร้อยแล้ว');
        } catch (\Throwable $e) {
            DB::rollBack();
            // report($e);
            dd($e->getMessage());

            return back()
                ->withErrors(['message' => 'เกิดข้อผิดพลาดขณะบันทึกรายงาน กรุณาลองใหม่'])
                ->withInput();
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // ค้นหา Daily Report เฉพาะของผู้ใช้ปัจจุบัน
        $report = DailyReport::with('tasks', 'attendance')
            ->where('id', $id)
            ->whereHas('attendance', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->firstOrFail();

        return Inertia::render('web/daily_report/edit', [
            'report' => [
                'id' => $report->id,
                'summary_text' => $report->summary_text,
                'tasks' => $report->tasks->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'task_type' => $task->task_type,
                        'project_name' => $task->project_name,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'summary_text' => 'nullable|string',
                'tasks' => 'required|array|min:1',
                'tasks.*.task_type' => 'required|string',
                'tasks.*.project_name' => 'required|string',
            ], [
                'tasks.required' => 'กรุณาระบุรายการงานอย่างน้อย 1 รายการ',
                'tasks.*.task_type.required' => 'กรุณาระบุประเภทงาน',
                'tasks.*.project_name.required' => 'กรุณาระบุชื่อโปรเจกต์',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            DB::beginTransaction();

            // ตรวจสอบว่า report นี้เป็นของ user และวันนี้
            $report = DailyReport::where('id', $id)
                ->whereHas('attendance', function ($q) {
                    $q->where('user_id', Auth::id())
                        ->whereDate('date', now()->toDateString());
                })
                ->firstOrFail();

            // อัปเดต summary
            $report->update([
                'summary_text' => $request->summary_text,
            ]);

            // ลบ tasks เดิม แล้วเพิ่มใหม่
            $report->tasks()->delete();

            foreach ($request->tasks as $task) {
                $report->tasks()->create([
                    'task_type' => $task['task_type'],
                    'project_name' => $task['project_name'],
                ]);
            }

            DB::commit();

            return redirect()
                ->route('daily-report.edit', $report->id)
                ->with('success', 'อัปเดตรายงานเรียบร้อยแล้ว');
        } catch (\Throwable $e) {
            DB::rollBack();
            // report($e);
            dd($e->getMessage());

            return back()
                ->withErrors(['message' => 'เกิดข้อผิดพลาดขณะอัปเดตรายงาน กรุณาลองใหม่'])
                ->withInput();
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function history()
    {
        $attendances = Attendance::where('user_id', Auth::id())
            ->orderByDesc('date')
            ->paginate(30);

        return Inertia::render('web/daily_report/history', [
            'attendances' => $attendances,
        ]);
    }
}
