function Test() {



    const currentDate = new Date().toISOString().split('T')[0];



    const appointments = [
        {
            subject: 'Pizza Party 22',
            date: '2024-11-22',
            start: '10:00',
            end: '12:00',
            description: 'loirem'
        },
        {
            subject: 'Pizza Party 22',
            date: '2024-11-22',
            start: '10:00',
            end: '12:00',
            description: 'loirem'
        },
        {
            subject: 'Pizza Party 23',
            date: '2024-11-23',
            start: '10:00',
            end: '12:00',
            description: 'loirem'
        },
        {
            subject: 'Pizza Party 23',
            date: '2024-11-23',
            start: '10:00',
            end: '12:00',
            description: 'loirem'
        }
    ];


    return (
        <ol className="flex bg-blue-100">

            <li>
                <article className="p-4">
                    <h4 className="text-lg font-bold">22</h4>
                    <ol className="space-y-5">
                        {

                            appointments
                                .filter(appointment => appointment.date === currentDate)  // Filters appointments by today's date
                                .map((appointment, index) => (  // Maps through filtered appointments
                                    <li key={index}>  {/* Add a unique 'key' prop to the list item */}
                                        <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
                                            <h4 className="mb-4 text-xl font-bold text-center text-gray-800">{appointment.subject}</h4>
                                            <p className="mb-2 text-sm text-gray-600">
                                                <span className="font-semibold">Time: </span><time>{appointment.start} {appointment.end}</time>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Description:</span>{appointment.description}
                                            </p>
                                        </article>
                                    </li>
                                ))
                        };
                    </ol>
                </article>
            </li>
            <li>
                <article className="p-4">
                    <h4 className="text-lg font-bold">23</h4>
                    <ol className="space-y-5">
                        {

                            appointments
                                .filter(appointment => appointment.date === currentDate)  // Filters appointments by today's date
                                .map((appointment, index) => (  // Maps through filtered appointments
                                    <li key={index}>  {/* Add a unique 'key' prop to the list item */}
                                        <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
                                            <h4 className="mb-4 text-xl font-bold text-center text-gray-800">{appointment.subject}</h4>
                                            <p className="mb-2 text-sm text-gray-600">
                                                <span className="font-semibold">Time: </span><time>{appointment.start} {appointment.end}</time>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Description:</span>{appointment.description}
                                            </p>
                                        </article>
                                    </li>
                                ))
                        };
                    </ol>
                </article>
            </li>

        </ol>


    );
}
export default Test;
