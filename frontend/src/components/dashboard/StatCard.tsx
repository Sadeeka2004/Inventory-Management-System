interface Props{

title:string;

value:number;

}



function StatCard({
title,
value
}:Props){


return(

<div className="border rounded p-5 shadow">


<h2 className="text-gray-600">

{title}

</h2>


<p className="text-3xl font-bold">

{value}

</p>


</div>

);


}


export default StatCard;