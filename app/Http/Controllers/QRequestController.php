<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\QueueInformation;

class QRequestController extends Controller
{
    private const API_KEY = 'klenthadechristian';

    // Show the web form
    public function main()
    {
        return view('QRequest.main');
    }

    public function insert(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'student_id' => 'required|string|max:255',
                'purpose' => 'required|string|max:255',
                'email' => 'required|email|max:255',
            ]);


            // Create queue request
            QRequest::create($queueData);

            return response()->json([
                'success' => true,
                'data' => $queueData,
                'emailSent' => true
            ]);
        } catch (\Exception $e) {
            Log::error('Request creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create queue request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function apiStore(Request $request): JsonResponse
    {
        $apiKey = $request->header('X-API-Key');
        if ($apiKey !== self::API_KEY) {
            return response()->json(['error' => 'Invalid API key'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'student_id' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        // Send request to your system's API
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'x-api-key' => env('line-manager-api-key'), 
        ])->post('http://172.20.10.6/line-manager/line-manager/public/api/queue/register', [
            'name' => $validated['name'],
            'student_id' => $validated['student_id'],
            'purpose' => $validated['purpose'],
            'email' => $validated['email'],
        ]);

        if ($response->status() === 201) {
            // Success: return the queue number from your system
            return response()->json([
                'message' => 'Queue request created successfully',
                'queue_number' => $response->json('queue_number'),
                'data' => $response->json(),
            ], 201);
        } elseif ($response->status() === 409) {
            // Queue is full
            return response()->json([
                'error' => $response->json('message'),
                'current_size' => $response->json('current_size'),
                'max_size' => $response->json('max_size'),
            ], 409);
        } else {
            // Other errors
            return response()->json([
                'error' => 'Failed to register queue. Please try again later.',
                'details' => $response->json(),
            ], $response->status());
        }
    }


    public function sendQueueEmail(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'name' => 'required|string',
                'queueNumber' => 'required',
                'studentId' => 'required|string',
                'purpose' => 'required|string'
            ]);

            $queueData = [
                'name' => $validated['name'],
                'queueNumber' => $validated['queueNumber'],
                'student_id' => $validated['studentId'],
                'purpose' => $validated['purpose']
            ];

            Mail::to($validated['email'])->send(new QueueInformation($queueData));

            return response()->json(['message' => 'Email sent successfully']);
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send email'], 500);
        }
    }
}
