interface TableProps {

    headers:string[];

    children:React.ReactNode;

}


function Table({
    headers,
    children
}:TableProps){


return (

<table className="w-full border">


<thead>

<tr>

{
headers.map((header)=>(

<th
key={header}
className="border p-2 text-left"
>

{header}

</th>

))

}

</tr>

</thead>



<tbody>

{children}

</tbody>



</table>

);


}


export default Table;