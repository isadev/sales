<?php
namespace App\Library;

use Phalcon\Db;
use App\Models\User;

class UserManager extends ComponentBase{

    public function getUserById($userId)
    {
        $user = new  User();
        $user = $user->findById($userId);

        if (!$user)
            return null;

        return $this->formatUser($user[0]);
    }

    public function getUserByEmail($email)
    {
        $user = new User();
        $user = $user->findByEmail($email);

        if (!$user)
            return null;
        return $this->formatUser($user[0]);
    }

    public function getUserPassword($email)
    {
        $query = "SELECT password FROM user WHERE email = :email";
        $item = $this->getDb()->fetchOne($query, Db::FETCH_ASSOC, ['email' => $email]);

        if ($item == false)
        {
            return false;
        }

        return $item['password'];
    }

    public function isEmailAvailable($email)
    {
        $query = "SELECT count(email) c FROM user WHERE email = :email";
        $item = $this->getDb()->fetchOne($query, Db::FETCH_ASSOC, ['email' => $email]);
        return intval($item['c']) == 0;
    }

    public function saveUser(User $user)
    {
        if (!$user)
            return false;

        $existingUser = $this->getUserMgr()->getUserByEmail($user->email);

        if ($existingUser != null)
        {
            // there is already a user with that email
            return User::ERR_EXISTING_USER;
        }

        if ($existingUser == null) {
            if ($user == null) {
                $this->getLog()->error("Tried to create an already existing user " . $user->email);
                // TODO: Security Exception
                // trying to modify a user for a different customer
                return User::ERR_SECURITY;
            }
            $this->createUser($user);
            return true;
        }

        $this->updateUser($user);
        return true;
    }

    public function deleteUser(User $user)
    {
        $query = "DELETE FROM `user` WHERE `id` = :userid";

        if($this->db->execute($query, ['userid' => $user->id]))
        {
            return true;
        }
        return null;
    }

    public function updateUserData($username, $email, $password,$lang)
    {
        $query = "UPDATE user SET ";
        $props = ["username" => $username];

        $parts = [];

        if ($email)
        {
            $parts[] = " email = :email";
            $props['email'] = $email;
        }

        if ($password)
        {
            $parts[] = " password = :password";
            $props['password'] = UserManager::encryptPassword($password);
        }

        if($lang)
        {
            $parts[] = "languageId = :lang";
            $props['lang'] = intval($lang);
        }

        if (count($parts) == 0)
            return;

        $query .= implode(', ', $parts);
        $query .= " WHERE username = :username";

        $this->db->execute($query, $props);
    }

    /**
     * Encrypts a password.
     * Note: This is the v2 implementation, it's crap!
     * @param $value
     * @return string
     */
    public static function encryptPassword($value)
    {
        return md5($value);
    }

    public function recoverPassword($email)
    {
        // Find the username from the email
        $query = "SELECT username FROM user where email = :email";
        $item = $this->db->fetchOne($query, Db::FETCH_ASSOC, ['email' => $email]);

        if (!$item) {
            return false;
        }

        $username = $item['username'];

        // generate a random token
        $token = Utils::randomString(20);
        $query = "INSERT INTO userRecoveries (token, email, username) VALUES (:token, :email, :username)";
        $props = ['token' => $token, 'email' => $email, 'username' => $username];

        $this->db->execute($query, $props);

        return $token;
    }

    public function tokenPasswordReset($token, $password)
    {
        // fetch the username related to the token
        $query = "SELECT username FROM userRecoveries WHERE createdOn > DATE_ADD(now(), INTERVAL -1 DAY) AND token = :token";
        $item = $this->db->fetchOne($query, Db::FETCH_ASSOC, ['token' => $token]);

        if (!$item)
            return false;

        // change the user's password
        $username = $item['username'];
        $password = UserManager::encryptPassword($password);

        $query = "UPDATE user SET password = :password WHERE (username = :username)";
        $this->db->execute($query, ['username' => $username, 'password' => $password]);

        // remove the token
        $this->db->execute("DELETE FROM userRecoveries WHERE token = :token", ['token' => $token]);

        return true;
    }

    public function isValidPasswordToken($token)
    {
        $query = "SELECT count(token) c FROM userRecoveries WHERE createdOn > DATE_ADD(now(), INTERVAL -1 DAY) AND token = :token";
        $item = $this->db->fetchOne($query, Db::FETCH_ASSOC, ['token' => $token]);
        return (!$item ? false : intval($item['c']) !== 0);
    }

    private function createUser(User $user)
    {
        if ($user->save() === false) { 
            $messages = $user->getMessages(); 
            foreach ($messages as $message) { 
                echo $message, "\n"; 
            }
            return false;
        }
        $guid = $user->id;
        $this->getLog()->info("Created new user ($guid) ");
        return $guid;
    }

    private function updateUser(User $user)
    {
        $props = [
            'firstName' => $user->firstName,
            'email'     => $user->email
        ];

        $query = "UPDATE user SET firstName = :firstName, email = :email, languageId = :languageId  ";

        if ($user->newPassword) {
            $query .= ", password = :password ";
            $props['password'] = UserManager::encryptPassword($user->newPassword);
        }

        $query .= " WHERE (username = :username)";

        $this->db->execute($query, $props);

        $this->getLog()->info("Updated user (" . $user->id . ") " . json_encode($props));
    }

    private function formatUser($item)
    {
        $user = new User();
        $user->id = $item->getId();
        $user->email = $item->getEmail();
        $user->first_name = $item->getFirstName();
        $user->last_name = $item->getLastName();
        $user->enabled = $item->getEnabled();
        $user->bpulse_user_token = $item->getBpulseUserToken();
        $user->google_push_token = $item->getGooglePushToken();
        $user->client_id = $item->getClientId();
        $user->language = $item->getLanguage();
        $user->impersonate = $item->getImpersonate();
        $user->role_id = $item->getRoleId();
        $user->sync_status_id = $item->getSyncStatusId();
        
        return $user;
    }
}