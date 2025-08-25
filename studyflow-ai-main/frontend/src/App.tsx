import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema: Define form validation rules
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  hoursPerWeek: z.number().min(1).max(40),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  availability: z.array(z.string()).min(1, "Select at least one time block"),
  learningStyle: z.enum(["visual", "auditory", "reading", "kinesthetic"]),
});



type FormData = z.infer<typeof formSchema>;

function App() {
  // ✅ State
  const [step, setStep] = useState<1 | 3>(1); // Step 1: Form, Step 3: Results
  const [schedule, setSchedule] = useState<any[]>([]); // Store AI-generated plan

  // ✅ Form setup with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // ✅ Handle form submission
  const onSubmit = async (formData: FormData) => {
    try {
      const res = await fetch("http://localhost:8000/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        alert("Failed to generate schedule");
        return;
      }

      const data = await res.json();
      setSchedule(data.schedule); // Update schedule state
      setStep(3); // Go to results
    } catch (err) {
      console.error("Error:", err);
      alert("Connection failed. Is the backend running?");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">🎯 StudyFlow AI</h1>

      {/* Step 1: User Input Form */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl">🎯 Your Goal</h2>

          <input
            {...register("name")}
            placeholder="Your name"
            className="input"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <input
            {...register("subject")}
            placeholder="Subject (e.g. Python)"
            className="input"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject.message}</p>
          )}

          <input
            type="number"
            {...register("hoursPerWeek", { valueAsNumber: true })}
            placeholder="Hours per week"
            className="input"
          />
          {errors.hoursPerWeek && (
            <p className="text-red-500 text-sm">
              {errors.hoursPerWeek.message}
            </p>
          )}

          <input
            type="date"
            {...register("deadline")}
            className="input"
          />
          {errors.deadline && (
            <p className="text-red-500 text-sm">{errors.deadline.message}</p>
          )}

          <h2 className="text-xl mt-6">🕒 Availability</h2>
          <div className="space-y-2">
            <label className="block">
              <input
                type="checkbox"
                value="Mon 18-20"
                {...register("availability")}
              />{" "}
              Mon 6–8 PM
            </label>
            <label className="block">
              <input
                type="checkbox"
                value="Wed 18-20"
                {...register("availability")}
              />{" "}
              Wed 6–8 PM
            </label>
            <label className="block">
              <input
                type="checkbox"
                value="Sat 10-12"
                {...register("availability")}
              />{" "}
              Sat 10–12 PM
            </label>
          </div>
          {errors.availability && (
            <p className="text-red-500 text-sm">
              {errors.availability.message}
            </p>
          )}

          <h2 className="text-xl mt-6">🧠 Learning Style</h2>
          <select
            {...register("learningStyle")}
            className="input block"
          >
            <option value="">Choose...</option>
            <option value="visual">Visual</option>
            <option value="auditory">Auditory</option>
            <option value="reading">Reading/Writing</option>
            <option value="kinesthetic">Kinesthetic</option>
          </select>
          {errors.learningStyle && (
            <p className="text-red-500 text-sm">
              {errors.learningStyle.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          >
            Generate Schedule
          </button>
        </form>
      )}

      {/* Step 3: Show AI-Generated Schedule */}
      {step === 3 && (
        <div>
          <h2 className="text-xl mb-4">📅 Your Weekly Plan</h2>
          {schedule.length === 0 ? (
            <p>Generating schedule...</p>
          ) : (
            <ul className="space-y-2 mb-6">
              {schedule.map((task, i) => (
                <li
                  key={i}
                  className="border-l-4 border-blue-500 pl-2 py-1 bg-gray-50 rounded"
                >
                  <strong>{task.title}</strong> – {task.day} {task.time}
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 underline"
            >
              ← Back to Edit
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-gray-600 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;