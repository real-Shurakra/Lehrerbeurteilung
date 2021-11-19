<?php
/**
 * @brief MySQL database connection 
 * @details 
 * @param string $dbIpv4 = IPv4 Adress of the database server
 * @param string $dbUser = User for database
 * @param string $dbPass = Userpassword
 * @param string $dbName = Database name
 */
class DatabaseControl {
    function __construct($dbIpv4, $dbUser, $dbPass, $dbName){
        $this->dbIpv4 = $dbIpv4;
        $this->dbUser = $dbUser;
        $this->dbPass = $dbPass;
        $this->dbName = $dbName;
    }

    /**
     * @brief Connecting to database
     * @return array(rc:true,rv:string:"connected")
     * @except array(rc:false,rv:string)
     */
    protected function __connectToDatabase() {
        try{
            $this->link = mysqli_connect($this->dbIpv4, $this->dbUser, $this->dbPass, $this->dbName);
            if (!$this->link) {throw new ErrorException(mysqli_connect_error());}
            $answer = array('rc'=>true,'rv'=>'connected');
        }
        catch (ErrorException $error) {$answer = array('rc'=>false,'rv'=>'DatabaseControl.connectToDatabase->'.$error->getMessage());}
        finally{return $answer;}
    }

    /**
     * @brief sending sqlstring to database
     * @param $sqlString = Sql query
     * @return array(rc:true,rv:mixed)
     * @except array(rc:false,rv:string)
     */
    protected function __sendToDB($sqlString) {
        try{
            $sqlquaryResultData=array();
            ##var_dump($sqlString);
            $sqlquaryResult = mysqli_query($this->link, $sqlString);
            ##var_dump($sqlquaryResult);
            if (!$sqlquaryResult) {throw new ErrorException($this->link->error);}
            if ($sqlquaryResult===true) {$answer=array('rc'=>true,'rv'=>true);return;}
            for ($i = 0; $i < $sqlquaryResult->num_rows; $i++) {$sqlquaryResultData[$i] = mysqli_fetch_array($sqlquaryResult);}
            $answer = array('rc'=>true,'rv'=>$sqlquaryResultData);
        }
        catch(ErrorException $error){$answer = array('rc'=>false,'rv'=>'DatabaseControl.sendToDB->'.$error->getMessage());}
        finally{return $answer;}
    }

    /**
     * @brief Disconnecting from database
     * @return array(rc:true,rv:string:"disconnected")
     * @except array(rc:false,rv:string)
     */
    protected function __disconnectFromDatabase() {
        try{
            $this->link->close();
            $answer = array('rc'=>true,'rv'=>'disconected');
        }
        catch(ErrorException $error){$answer = array('rc'=>false,'rv'=>'DatabaseControl.disconnectFromDatabase->'.$error->getMessage());}
        finally{return $answer;}
    }

    /**@brief Database interface
     * @param string $sqlString SQL formated string
     * @return array(rc:true,rv:array(mixed))||array(rc:false,rv:string)
     */
    function sendOneToDatabase($sqlString){
        try{
            // Geting DB information
            // Connecting to DB
            $connectionResult = $this->__connectToDatabase();
            if (!$connectionResult['rc']) {throw new ErrorException($connectionResult['rv']);}
            // Sending sql querry
            $SendResult = $this->__sendToDB($sqlString);
            if ($SendResult['rc'] == false) {throw new ErrorException($SendResult['rv']);}
            // Disconnecting DB
            $this->__disconnectFromDatabase();
            // Formating answer
            $answer = array('rc'=>true, 'rv'=>$SendResult['rv']);
        }
        catch(ErrorException $error){$answer = array('rc'=>false, 'rv'=>'DatabaseControl.sendOneToDatabase->'.$error->getMessage());}
        finally{return $answer;}
    }
}