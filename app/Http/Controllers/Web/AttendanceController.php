<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Branch;
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
        $todayAttendance = Attendance::where('user_id', Auth::id())
            ->whereDate('date', today())
            ->first();

        $branches = Branch::select('id', 'name')->get();


        // dd($todayAttendance);

        return Inertia::render('web/check_in_out', [
            'hasClockedInToday' => $todayAttendance,
            'branches' => $branches
        ]);
    }

    // public function clock(Request $request)
    // {
    //     try {
    //         $user = Auth::user();
    //         $today = now()->toDateString();
    //         //    dd($request->all());
    //         //  ตรวจสอบความถูกต้องของข้อมูล
    //         $rule = [
    //             'type' => 'required|in:clock_in,clock_out',
    //             'is_offsite' => 'required|boolean',
    //             'offsite_link' => 'required_if:is_offsite,true|nullable|string',
    //             'branch_id' => 'required_if:is_offsite,false|nullable|exists:branches,id',
    //             'lat' => 'required_if:is_offsite,false|nullable|string',
    //             'lng' => 'required_if:is_offsite,false|nullable|string',
    //         ];

    //         $message = [
    //             // type
    //             'type.required' => 'ประเภทการลงเวลา (เข้างาน/ออกงาน) จำเป็นต้องระบุ',
    //             'type.in' => 'ประเภทการลงเวลาไม่ถูกต้อง ต้องเป็น clock_in หรือ clock_out เท่านั้น',

    //             // is_offsite
    //             'is_offsite.required' => 'ต้องระบุว่าเป็นการลงเวลานอกสถานที่หรือไม่',
    //             'is_offsite.boolean' => 'ค่าของ is_offsite ต้องเป็น true หรือ false',

    //             // offsite_link
    //             'offsite_link.required_if' => 'กรุณาระบุลิงก์สถานที่เมื่อลงเวลานอกสถานที่',
    //             'offsite_link.string' => 'ลิงก์สถานที่ต้องเป็นข้อความ',

    //             // branch_id
    //             'branch_id.required_if' => 'กรุณาระบุสาขาเมื่อลงเวลาในสถานที่',
    //             'branch_id.exists' => 'สาขาที่เลือกไม่มีอยู่ในระบบ',

    //             // lat
    //             'lat.required_if' => 'กรุณาระบุละติจูดเมื่อลงเวลาในสถานที่',
    //             'lat.string' => 'ละติจูดต้องเป็นข้อความ',

    //             // lng
    //             'lng.required_if' => 'กรุณาระบุลองจิจูดเมื่อลงเวลาในสถานที่',
    //             'lng.string' => 'ลองจิจูดต้องเป็นข้อความ',
    //         ];

    //         $validator = Validator::make($request->all(), $rule, $message);

    //         if ($validator->fails()) {
    //             return back()->withErrors($validator)->withInput();
    //         }

    //         $validated = $validator->validated();
    //         // dd($request->all());

    //         // ค้นหา/สร้าง attendance สำหรับวันนี้
    //         $attendance = Attendance::firstOrCreate(
    //             ['user_id' => $user->id, 'date' => $today],
    //             ['branch_id' => $validated['branch_id'] ?? null]
    //         );

    //         if ($validated['type'] === 'clock_in') {
    //             if ($attendance->clock_in_time) {
    //                 return back()->withErrors(['message' => 'คุณได้ลงเวลาเข้าแล้ววันนี้']);
    //             }

    //             $attendance->update([
    //                 'clock_in_time' => now(),
    //                 'is_offsite' => $validated['is_offsite'],
    //                 'offsite_gmap_link' => $validated['offsite_link'],
    //                 'clock_in_location_lat' => $validated['lat'],
    //                 'clock_in_location_lng' => $validated['lng'],
    //                 'branch_id' => $validated['branch_id'] ?? null,
    //             ]);

    //             return back()->with('success', 'ลงเวลาเข้าเรียบร้อย');
    //         }

    //         if ($validated['type'] === 'clock_out') {
    //             if ($attendance->clock_out_time) {
    //                 return back()->withErrors(['message' => 'คุณได้ลงเวลาออกแล้ววันนี้']);
    //             }

    //             $attendance->update([
    //                 'clock_out_time' => now(),
    //                 'clock_out_location_lat' => $validated['lat'],
    //                 'clock_out_location_lng' => $validated['lng'],
    //             ]);

    //             return back()->with('success', 'ลงเวลาออกเรียบร้อย');
    //         }

    //         return back()->withErrors(['message' => 'ประเภทไม่ถูกต้อง']);
    //     } catch (\Throwable $e) {
    //         dd($e->getMessage());
    //         Log::error('Clock In/Out Error: ' . $e->getMessage(), [
    //             'user_id' => Auth::id(),
    //             'request' => $request->all(),
    //         ]);

    //         return back()->withErrors([
    //             'message' => 'เกิดข้อผิดพลาด ไม่สามารถบันทึกเวลาได้'
    //         ]);
    //     }
    // }

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

                $attendance->is_offsite = $validated['is_offsite'];

                if ($validated['is_offsite']) {
                    $attendance->offsite_latitude = $validated['lat'];
                    $attendance->offsite_longitude = $validated['lng'];
                    $attendance->offsite_gmap_link = $validated['offsite_link'];
                } else {
                    $attendance->branch_id = $validated['branch_id'];
                    $branch = Branch::find($validated['branch_id']);
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

                $attendance->clock_out_time = $now;
                $attendance->clock_out_location_lat = $validated['lat'];
                $attendance->clock_out_location_lng = $validated['lng'];
                $attendance->status = $attendance->is_offsite ? 'offsite' : 'on_time';
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
}
