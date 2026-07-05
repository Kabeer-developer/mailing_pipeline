import { useState } from "react";

import { runPipeline } from "../api/pipelineApi";

import ContactsTable from "../components/ContactsTable";
import EmailEditor from "../components/EmailEditor";


function Dashboard() {

  const [domain, setDomain] = useState("");

  const [contacts, setContacts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);



  const handleRun = async () => {

    try {

      if (!domain) {
        alert("Enter domain");
        return;
      }


      setLoading(true);


      const data =
        await runPipeline(domain);


      setContacts(
        data.contacts
      );


    } catch (error) {

      console.log(error);

      alert(
        "Failed to fetch contacts"
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div
      className="
      min-h-screen
      bg-gray-100
      p-10
      "
    >


      <div
        className="
        max-w-6xl
        mx-auto
        bg-white
        rounded-xl
        shadow
        p-8
        "
      >


        <h1
          className="
          text-4xl
          font-bold
          text-center
          mb-8
          "
        >

          Automated Outreach Pipeline

        </h1>



        {/* DOMAIN INPUT */}

        <div
          className="
          flex
          justify-center
          gap-4
          "
        >


          <input

            className="
            border
            p-3
            rounded
            w-96
            "

            placeholder="
            example: openai.com
            "

            value={domain}

            onChange={
              (e) =>
                setDomain(
                  e.target.value
                )
            }

          />



          <button

            onClick={handleRun}

            disabled={loading}

            className="
            bg-black
            text-white
            px-6
            rounded
            "

          >


            {
              loading
                ?
                "Finding Leads..."
                :
                "Find Leads"
            }


          </button>


        </div>



        {/* CONTACT PREVIEW */}


        <ContactsTable
          contacts={contacts}
        />



        {/* EMAIL SENDING */}


        <EmailEditor
          contacts={contacts}
        />



      </div>


    </div>

  );

}


export default Dashboard;