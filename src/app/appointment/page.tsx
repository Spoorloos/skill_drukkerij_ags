export default function Appointment() {
    return (
        <main className="flex p-8 items-center flex-col">
            <h1 className="font-bold text-xl">Appointment</h1>
            <form className="flex gap-4 flex-col w-[30rem]">
                <label htmlFor="subject">Subject</label>
                <input className="p-1 border-2 border-blue-300 rounded-lg" id="subject" type="text" required/>


                <label htmlFor="description">Description</label>
                <textarea className="h-40 border-2 border-blue-300" id="description"></textarea>


                <label htmlFor="people_to_add">People to add:</label>
                <input className="border-2 border-blue-300" id="subject" type="text" />

                <div>
                    <p>add everyone:</p>
                    <input className="w-5 h-5" type="checkbox" />
                </div>



                <label htmlFor="date">Date</label>
                <input className="border-2 border-blue-300" id="subject" type="date" required/>


                <label htmlFor="time">Time</label>
                <input className="border-2 border-blue-300" id="subject" type="time" required/>


                <label htmlFor="location">Location</label>
                <input className="border-2 border-blue-300" id="subject" type="text" />


                <button type="submit">test</button>

            </form>
        </main>
    );
}