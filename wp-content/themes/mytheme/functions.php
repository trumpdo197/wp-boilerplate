<?php
if (!session_id()) {
    session_start();
}

require_once(dirname(__FILE__) . '/includes/setup.php');
