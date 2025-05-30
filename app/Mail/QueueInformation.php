<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class QueueInformation extends Mailable
{
    use Queueable, SerializesModels;

    public $queueData;

    public function __construct($queueData)
    {
        $this->queueData = $queueData;
    }

    public function build()
    {
        return $this->subject('Your Queue Information')
                    ->view('emails.queue-information');
    }
}