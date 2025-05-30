@extends('errors.layout')

@section('title', '404 Not Found')
@section('code', '404')
@section('message', 'ไม่พบหน้าที่คุณต้องการ')

@section('redirect')
    {{-- <a href="{{ url()->previous() }}"
        class="btn-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
        กลับ
    </a> --}}

@endsection
