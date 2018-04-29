<?php
namespace App\Library;

use App\Library\ComponentBase;
use App\Models\Client;
use Phalcon\Db;

class Auth extends ComponentBase
{

    const AUTH_IDENT_KEY = 'auth-identity';
    const AUTH_IMPERSONATE_USER_KEY = 'auth-user-impersonate';
    const AUTH_IMPERSONATE_CLIENT_KEY = 'auth-client-impersonate';

    /**
     * Check the user credentials and log them in
     * @param $username
     * @param $password
     * @return bool
     * @throws \Exception
     */
    public function logIn($email, $password) {
        // clear out any session data first
        $this->logOut();
        $userMgr = $this->getUserMgr();
        $storedPassword = $userMgr->getUserPassword($email);

        if ($storedPassword == false) {
            return false;
        }

        if ($storedPassword == $userMgr->encryptPassword($password)) {
            $this->getLog()->info("User $email logged in");
            // load the user object and store it in session
            $user = $userMgr->getUserByEmail($email);
            $this->session->set(Auth::AUTH_IDENT_KEY, $user);
            return true;
        }

        return false;
    }

    /**
     * Impersonate User
     */
    public function impersonateUser($email) {
        $this->setImpersonateUser($email);

        return true;
    }

    /**
     * Impersonate Client
     */
    public function impersonateClient($clientId) {
        $this->setImpersonateClient($clientId);

        return true;
    }

    /**
     * Destroy the user session
     */
    public function logOut() {
        if ($this->cookies->has('RMU')) {
            $this->cookies->get('RMU')->delete();
        }

        if ($this->cookies->has('RMT')) {
            $this->cookies->get('RMT')->delete();
        }

        $this->session->remove(Auth::AUTH_IDENT_KEY);
        $this->session->remove(Auth::AUTH_IMPERSONATE_USER_KEY);  
        $this->session->remove(Auth::AUTH_IMPERSONATE_CLIENT_KEY);  
    }

    /**
     * Get the currently logged in user
     * @return User|bool
     */
    public function getUser() {
        $user = $this->session->get(Auth::AUTH_IMPERSONATE_USER_KEY) ? $this->session->get(Auth::AUTH_IMPERSONATE_USER_KEY) : $this->session->get(Auth::AUTH_IDENT_KEY);

        if($this->session->get(Auth::AUTH_IMPERSONATE_CLIENT_KEY)){
            $client = $this->session->get(Auth::AUTH_IMPERSONATE_CLIENT_KEY);
            $user->client_id=$client[0]->getId();
        }
        return $user ? $user : false;
    }

    public function setUser($email){
        $user = $this->getUserMgr()->getUserByEmail($email);
        $this->session->set(Auth::AUTH_IDENT_KEY, $user);
    }
    
    public function setImpersonateUser($email)
    {
        $user = $this->getUserMgr()->getUserByEmail($email);
        $user->impersonate = true;
        if(!$user){
            return false;
        }
        $this->session->set(Auth::AUTH_IMPERSONATE_USER_KEY, $user);  
    }
    
    public function setImpersonateClient($clientId)
    {
        $client = new Client();
        $client = $client->findById($clientId);
        if(!$client){
            return false;
        }
        $this->session->set(Auth::AUTH_IMPERSONATE_CLIENT_KEY, $client);
    }

    public function setUserFilter($controller,$filter)
    {
        $filters = array($controller => $filter);
        $this->session->set('filters', $filters);   
    }

    public function getUserFilter()
    {
        $filter = $this->session->get('filters');
        return $filter ? $filter : false;
    }
}