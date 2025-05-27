<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Branch;
use App\Models\OffsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function showCheckInOutPage()
    {
        $todayAttendance = Attendance::with('dailyReport')
            ->where('user_id', Auth::id())
            ->whereDate('date', today())
            ->first();

        $branches = Branch::all();

        return Inertia::render('web/check_in_out', [
            'attendance' => $todayAttendance,
            'branches' => $branches
        ]);
    }

    public function clock(Request $request)
    {
        // dd($request->all());
        try {
            $rule = [
                'type' => 'required|in:clock_in,clock_out',
                'is_offsite' => 'required|boolean',
                'offsite_link' => 'required_if:is_offsite,true|nullable|string',
                'branch_id' => 'required_if:is_offsite,false|nullable|exists:branches,id',
                'lat' => 'required_if:is_offsite,false|nullable|string',
                'lng' => 'required_if:is_offsite,false|nullable|string',
            ];

            $message = [
                // type
                'type.required' => 'ประเภทการลงเวลา (เข้างาน/ออกงาน) จำเป็นต้องระบุ',
                'type.in' => 'ประเภทการลงเวลาไม่ถูกต้อง ต้องเป็น clock_in หรือ clock_out เท่านั้น',

                // is_offsite
                'is_offsite.required' => 'ต้องระบุว่าเป็นการลงเวลานอกสถานที่หรือไม่',
                'is_offsite.boolean' => 'ค่าของ is_offsite ต้องเป็น true หรือ false',

                // offsite_link
                'offsite_link.required_if' => 'กรุณาระบุลิงก์สถานที่เมื่อลงเวลานอกสถานที่',
                'offsite_link.string' => 'ลิงก์สถานที่ต้องเป็นข้อความ',

                // branch_id
                'branch_id.required_if' => 'กรุณาระบุสาขาเมื่อลงเวลาในสถานที่',
                'branch_id.exists' => 'สาขาที่เลือกไม่มีอยู่ในระบบ',

                // lat
                'lat.required_if' => 'กรุณาระบุละติจูดเมื่อลงเวลาในสถานที่',
                'lat.string' => 'ละติจูดต้องเป็นข้อความ',

                // lng
                'lng.required_if' => 'กรุณาระบุลองจิจูดเมื่อลงเวลาในสถานที่',
                'lng.string' => 'ลองจิจูดต้องเป็นข้อความ',
            ];
            $validator = Validator::make($request->all(), $rule, $message);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $validated = $validator->validated();
            $user = Auth::user();
            $now = Carbon::now();
            $today = $now->toDateString();

            $attendance = Attendance::firstOrNew([
                'user_id' => $user->id,
                'date' => $today,
            ]);

            if ($validated['type'] === 'clock_in') {
                if ($attendance->exists && $attendance->clock_in_time) {
                    return back()->withErrors(['คุณได้ Clock In แล้ววันนี้']);
                }

                $attendance->is_offsite_in = $validated['is_offsite'];

                if ($validated['is_offsite']) {
                    $attendance->offsite_latitude = $validated['lat'];
                    $attendance->offsite_longitude = $validated['lng'];
                    $attendance->offsite_gmap_link_in = $validated['offsite_link'];
                } else {
                    $attendance->branch_in_id = $validated['branch_id'];
                    $branch = Branch::find($validated['branch_id']);
                    $attendance->branch_in_id = $branch->id;
                    $distance = $this->calculateDistance(
                        $branch->latitude,
                        $branch->longitude,
                        $validated['lat'],
                        $validated['lng']
                    );

                    // dd([
                    //     'branch_lat' => $branch->latitude,
                    //     'branch_lng' => $branch->longitude,
                    //     'user_lat' => $validated['lat'],
                    //     'user_lng' => $validated['lng'],
                    //     'calculated_distance_meters' => $distance,
                    //     'allowed_radius_meters' => $branch->radius_meters,
                    // ]);

                    if ($distance > $branch->radius_meters) {
                        return back()->withErrors(['คุณอยู่นอกพื้นที่สาขา']);
                    }
                }

                $attendance->clock_in_time = $now;
                $attendance->clock_in_location_lat = $validated['lat'];
                $attendance->clock_in_location_lng = $validated['lng'];

                // คำนวณ clock_in_status
                $expectedStartTime = null;

                if ($validated['is_offsite']) {
                    $offsite = OffsiteSetting::first();
                    if ($offsite && $offsite->work_start_time) {
                        $expectedStartTime = Carbon::createFromFormat('H:i:s', $offsite->work_start_time)->setDateFrom($now);
                    }
                } else {
                    if (isset($branch) && $branch->work_start_time) {
                        $expectedStartTime = Carbon::createFromFormat('H:i:s', $branch->work_start_time)->setDateFrom($now);
                    }
                }

                if ($expectedStartTime) {
                    if ($now->lt($expectedStartTime)) {
                        $attendance->clock_in_status = 'early';
                    } elseif ($now->eq($expectedStartTime)) {
                        $attendance->clock_in_status = 'on_time';
                    } else {
                        $attendance->clock_in_status = 'late';
                    }
                }

                $attendance->save();

                return back()->with('success', 'Clock In สำเร็จ');
            }

            if ($validated['type'] === 'clock_out') {
                if (!$attendance->clock_in_time) {
                    return back()->withErrors(['ยังไม่ได้ Clock In วันนี้']);
                }

                if ($attendance->clock_out_time) {
                    return back()->withErrors(['คุณได้ Clock Out แล้ววันนี้']);
                }

                if (!$attendance->dailyReport) {
                    return back()->withErrors(['กรุณากรอก Daily Report ก่อน Clock Out']);
                }

                $expectedEndTime = null;

                if (!$validated['is_offsite']) {
                    $branch = Branch::find($validated['branch_id']);
                    if ($branch) {
                        $distance = $this->calculateDistance(
                            $branch->latitude,
                            $branch->longitude,
                            $validated['lat'],
                            $validated['lng']
                        );

                        if ($distance > $branch->radius_meters) {
                            return back()->withErrors(['คุณอยู่นอกพื้นที่สาขา ไม่สามารถ Clock Out ได้']);
                        }

                        if ($branch->work_end_time) {
                            $expectedEndTime = Carbon::createFromFormat('H:i:s', $branch->work_end_time)->setDateFrom($now);
                        }

                        $attendance->branch_out_id = $branch->id;
                    }
                } else {
                    $offsite = OffsiteSetting::first();
                    if ($offsite && $offsite->work_end_time) {
                        $expectedEndTime = Carbon::createFromFormat('H:i:s', $offsite->work_end_time)->setDateFrom($now);
                    }
                }

                //  คำนวณ clock_out_status
                if ($expectedEndTime) {
                    if ($now->lt($expectedEndTime)) {
                        $attendance->clock_out_status = 'early';
                    } elseif ($now->eq($expectedEndTime)) {
                        $attendance->clock_out_status = 'on_time';
                    } else {
                        $attendance->clock_out_status = 'late';
                    }
                }

                $attendance->is_offsite_out = $validated['is_offsite'];
                $attendance->clock_out_time = $now;
                $attendance->clock_out_location_lat = $validated['lat'];
                $attendance->clock_out_location_lng = $validated['lng'];

                if ($validated['is_offsite']) {
                    $attendance->offsite_gmap_link_out = $validated['offsite_link'];
                }

                $attendance->save();

                return back()->with('success', 'Clock Out สำเร็จ');
            }


            return back()->withErrors(['คำสั่งไม่ถูกต้อง']);
        } catch (\Exception $e) {
            dd($e->getMessage());
            Log::error('Clock In/Out error: ' . $e->getMessage());
            return back()->withErrors(['เกิดข้อผิดพลาดในการดำเนินการ กรุณาลองใหม่อีกครั้ง']);
        }
    }

    private function calculateDistance($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371000;

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    public function index()
    {
        $attendances = Attendance::where('user_id', Auth::id())
            ->orderByDesc('date')
            ->paginate(30);

        return Inertia::render('web/daily_report/history', [
            'attendances' => $attendances,
        ]);
    }
}
