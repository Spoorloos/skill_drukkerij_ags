
import { createClient } from '@supabase/supabase-js';




const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);


async function Schedule() {

    const { data, error } = await supabase
        .from('fred_appointment')
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
    }

    // appointments data
    const appointments = data;

    if (appointments == null) {
        console.log('appointment is null')
    } else {

        // filter out invalid appointments
        const validAppointments = appointments.filter(appointment => appointment.start_time < appointment.end_time);

        // generates upcoming days
        const today = new Date();
        const upcomingDays = Array.from({ length: 5 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return date.toDateString().substring(0, 3);
        });

        return (
            <main className="p-8 pb-0 space-y-8">
                <section>
                    <h2 className="pb-4 text-xl font-bold">Schedule</h2>
                    <ol className="flex bg-blue-100">
                        {Array.from({ length: upcomingDays.length }).map((_, repeatIndex) => (
                            <li key={repeatIndex}>
                                <article className="p-4">
                                    <h4 className="text-lg font-bold">
                                        {upcomingDays[repeatIndex]}
                                    </h4>
                                    <ol className="space-y-5">
                                        {validAppointments

                                            //filters appointments that fit in each day
                                            .filter(appointment => {
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + repeatIndex);
                                                const tomorrowDate = tomorrow.toISOString().split('T')[0];
                                                return appointment.date === tomorrowDate;
                                            })

                                            // arranges the starting time in chronological order
                                            .sort((a, b) => a.start_time.localeCompare(b.start_time))

                                            //places the appointments
                                            .map((appointment, index) => (
                                                <li key={index}>
                                                    <article className="w-[20rem] p-6 mx-auto bg-white rounded-lg shadow-md">
                                                        <h4 className="mb-4 text-xl font-bold text-center text-gray-800">{appointment.subject}</h4>
                                                        <p className="mb-2 text-sm text-gray-600">
                                                            <span className="font-semibold">Time: </span>
                                                            <time>{appointment.start_time} - {appointment.end_time}</time>
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-semibold">Description:</span> {appointment.description}
                                                        </p>
                                                    </article>
                                                </li>
                                            ))}
                                    </ol>
                                </article>
                            </li>
                        ))}
                    </ol>
                </section>
            </main>
        )
    };
}
export default Schedule;
