<?php

class emailTemplates extends ControllerBase
{
    public function indexAction($params=null)
    {
        $this->view->t    = $this->getTranslation();
    }

}