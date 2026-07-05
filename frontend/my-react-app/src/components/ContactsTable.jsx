function ContactsTable({ contacts }) {

  if (!contacts.length) {
    return null;
  }


  return (
    <div className="mt-8 w-full max-w-5xl">

      <h2 className="text-xl font-bold mb-4">
        Contacts Found: {contacts.length}
      </h2>


      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead>

            <tr className="bg-gray-200">

              <th className="p-3 border">
                Name
              </th>

              <th className="p-3 border">
                Company
              </th>

              <th className="p-3 border">
                Title
              </th>

              <th className="p-3 border">
                Email
              </th>

            </tr>

          </thead>


          <tbody>

          {
            contacts.map(
              (contact,index)=>(

              <tr key={index}>

                <td className="p-3 border">
                  {contact.name}
                </td>


                <td className="p-3 border">
                  {contact.company}
                </td>


                <td className="p-3 border">
                  {contact.title}
                </td>


                <td className="p-3 border">
                  {contact.email}
                </td>

              </tr>

              )
            )
          }

          </tbody>


        </table>

      </div>

    </div>
  )
}


export default ContactsTable;