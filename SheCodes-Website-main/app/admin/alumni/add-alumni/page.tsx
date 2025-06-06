// app/admin/mentors/edit/[id]/page.tsx
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddAlumniPage: React.FC = () => {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [story, setStory] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [batch, setBatch] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      university,
      batch,
      story,
      instagram,
      linkedin,
      imageSrc, // <— direct URL string
    };

    try {
      const res = await fetch("http://localhost:8000/alumni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add alumni");

      alert("Alumni added successfully!");
      router.push("/admin/mentors");
    } catch (err) {
      console.error(err);
      alert("Error adding alumni.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "block text-md font-semibold text-black mb-2";
  const inputClass = "text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 focus:ring-2 focus:ring-blueSky";

  return (
    <main className="flex-1 px-10 py-6">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add Alumni</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image URL */}
          <div>
            <label className={labelClass}>Image URL<span className="text-red-500">*</span></label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Name<span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name here"
              className={inputClass}
              required
            />
          </div>

          {/* University */}
          <div>
            <label className={labelClass}>University<span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Enter university name"
              className={inputClass}
              required
            />
          </div>

          {/* Batch */}
          <div>
            <label className={labelClass}>Batch<span className="text-red-500">*</span></label>
            <Select
              value={batch.toString()}
              onValueChange={(value) => setBatch(parseInt(value) as 1 | 2)}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Story */}
          <div>
            <label className={labelClass}>Story<span className="text-red-500">*</span></label>
            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share the alumni’s success story..."
              rows={5}
              className={`${inputClass} min-h-[150px]`}
              required
            />
          </div>

          {/* Instagram */}
          <div>
            <label className={labelClass}>Instagram Link</label>
            <Input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className={labelClass}>LinkedIn Link</label>
            <Input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/..."
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blueSky hover:bg-blueSky/90 text-white font-semibold py-2.5 px-8 rounded-md"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddAlumniPage;
