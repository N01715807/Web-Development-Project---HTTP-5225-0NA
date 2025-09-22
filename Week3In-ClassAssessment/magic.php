<!doctype html>
<html>
<head><title>Magic Number Game</title></head>
<body>
    <h1>
        <?php
        $input = rand(1,1000);
        //if num(input)% 3 && 5 = 0 echo "FizzBuzz"
        if ($input % 3 == 0 && $input % 5 == 0){
            echo "FizzBuzz";
        }
        //elseif num(input)% 5 = 0 echo "Buzz"
        elseif($input % 5 == 0){
            echo "Buzz";
        }
        //elseif num(input)% 3 = 0 echo "Fizz"
        elseif($input % 3 == 0){
            echo "Fizz";
        }
        //else echo input
        else{echo $input;}
        ?>
    </h1>
</body>
</html>
