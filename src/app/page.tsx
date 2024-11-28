import Calendar from '@/components/Calendar';
import Email from '@/components/email_test';

export default function Schedule() {
    return (
        <main className="p-8 pb-0 space-y-8">
            <section>
                <h2 className="pb-4 text-xl font-bold">Schedule</h2>
                <Calendar />
            </section>

            <section>
                <h2>email test</h2>
                <Email />
            </section>
        </main>
    );
}