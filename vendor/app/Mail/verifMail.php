<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class verifMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $id;
    public $rand;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($id, $user, $rand)
    {
        $this->id = $id;
        $this->user = $user;
        $this->rand = $rand;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('verifMail')
                ->subject('Email verification');
    }
}
