<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RegistreTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('username');
            $table->string('avatar')->default('placeholder.png');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('verification_code');
            $table->integer('email_verified')->default(0);
            $table->string('password');
            $table->timestamp('Creation_Date')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
