import { useState } from "react";
import { executePipeline } from "../api/pipelineApi";


function EmailEditor({ contacts }) {


const [subject,setSubject] = useState(
"Quick question for {{company}}"
);


const [body,setBody] = useState(
`<p>Hi {{name}},</p>

<p>
I noticed you are working as {{title}} at {{company}}.
</p>

<p>
Would love to connect.
</p>

<p>
Regards,<br/>
Kabeer
</p>`
);


const [loading,setLoading] =
useState(false);



const handleSend = async()=>{


try{


setLoading(true);


const result =
await executePipeline(
contacts,
{
subject,
body
}
);


alert(
`Emails Sent: ${result.emailsSent}`
);


}
catch(error){

console.log(error);

alert(
"Email sending failed"
);

}
finally{

setLoading(false);

}


};



if(!contacts.length)
return null;



return (

<div className="
mt-10 
w-full 
max-w-4xl
border
p-5
rounded
">


<h2 className="
text-2xl
font-bold
mb-5
">
Email Template
</h2>


<input

className="
border
p-3
w-full
mb-4
rounded
"

value={subject}

onChange={
(e)=>setSubject(e.target.value)
}

/>



<textarea

className="
border
p-3
w-full
h-52
rounded
"

value={body}

onChange={
(e)=>setBody(e.target.value)
}

/>


<div className="
mt-3
text-sm
text-gray-500
">

Supported:
{" "}
{"{{name}} "}
{"{{company}} "}
{"{{title}}"}

</div>



<button

onClick={handleSend}

className="
mt-5
bg-green-600
text-white
px-6
py-3
rounded
"

>


{
loading
?
"Sending..."
:
"Send Emails"
}


</button>


</div>

)

}


export default EmailEditor;