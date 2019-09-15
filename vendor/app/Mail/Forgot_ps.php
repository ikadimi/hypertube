<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Forgot_ps extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $rand;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $rand)
    {
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
        return $this->view('ForgotMail')
                ->subject('Password reset');
    }
}
