<?php

class EmailController extends ControllerBase
{
    /**
     * Función que permite enviar el mail
     *
     * @param array $to Quien se envia el mail array('mail@mail.com'=>'usermail')
     * @param string $subject Titulo del mail
     * @param string $name Nombre del template que se va usar
     * @param array $params Parametros que usara el template
     * @return boolean Retorna 1 para true y 0 para false
     */
    public function sendAction()
    {
        try {
            $emailtemplate = "baseEmail";
            $parameters = [
                "title" => $this->getTranslation()->_("title"), 
                "textAction"=> $this->getTranslation()->_("textAction"),
                "buttonCenter"=> $this->getTranslation()->_("buttonCenter"),
                "textRecommended"=> $this->getTranslation()->_("textRecommended"),
                "textFooter"=> $this->getTranslation()->_("textFooter")
            ];
            return "enviado = ".$this->getMail()->send("ing.luisgonzalez23@gmail.com", "primercorreo", $emailtemplate, $parameters);
        }catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}