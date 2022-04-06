<?php
// connect to database
$mysqli = new mysqli("###############################","###########","############","###########");

if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}

$question = $mysqli -> real_escape_string($_POST['input']);
$lastAnswer = $mysqli -> real_escape_string($_POST['lastAnswer']);
$saveLastAnswers = $mysqli -> real_escape_string($_POST['saveLastAnswers']);

$questionParts = explode(" ", $question);
$requests = array();
if (count($questionParts) == 1)
{
	array_push($requests,$question . "%");
	array_push($requests,"%" . $question . "%");
	array_push($requests,$question);
}
else{
	foreach($questionParts as $part){
		array_push($requests,"%" . $part . "%");
	}
	
	array_push($requests,"%" . implode("%",$questionParts) . "%");
	
	for($i=0;$i<count($questionParts);$i++){
		array_shift($questionParts);
		array_push($requests,"%" . implode("%",$questionParts) . "%");
	}
}

if($saveLastAnswers == "true"){
	$sql = "SELECT * FROM bot
	WHERE query LIKE '%".$lastAnswer."%'; ";

	$result = $mysqli -> query($sql);

	$row = $result -> fetch_array(MYSQLI_NUM);
	$cnt = $result -> num_rows;

	if($cnt == 0){
		$sql = "INSERT INTO `bot`(`id`, `query`, `answer`) VALUES (null,'".$lastAnswer."','".$question. "')";
		$mysqli -> query($sql);
	}
}

$min = 1000;
$minResult;
$found = false;
foreach($requests as $request){
	$sql="SELECT answer FROM bot
	WHERE query LIKE '".$request."'; ";

	$result = $mysqli -> query($sql);

	$cnt = $result -> num_rows;
	if($cnt > 0 && $cnt < $min){
		$minResult = $result;
		$min = $cnt;
		$found = true;
	}
}


$rows = array();
if($found){
	while($row = $minResult -> fetch_array(MYSQLI_NUM))
	{
	   array_push($rows,$row);
	}
	echo $rows[array_rand($rows)][0];
}
else{
	if(count($questionParts) == 1){
		echo $question . " ,indeed";
	}
	else{
		echo "I'm sorry, my responses are limited";
	}
}

$mysqli -> close();
?>

