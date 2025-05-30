@extends('errors.layout')

@section('title', '403 Forbidden')
@section('code', '403')
@section('message', 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้')

@section('redirect')
    {{-- <a href="{{ url()->previous() }}"
        class="btn-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
        กลับหน้าที่แล้ว
    </a> --}}
@endsection
