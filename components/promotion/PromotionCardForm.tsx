"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ReCloudinary from "../cloudinary/ReCloudinary";
import { Plus, X, RefreshCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import { createCarouselCard } from "@/api/carouselCard";
import toast from "react-hot-toast";

interface PromotionCardData {
  order: number;
  image: string;
  title: string;
  description: string;
  ctaTitle: string;
  link: string;
  isNews: boolean;
}

const PromotionCardForm = () => {
  const [forms, setForms] = useState<PromotionCardData[]>([
    {
      order: 1,
      image: "",
      title: "",
      description: "",
      ctaTitle: "",
      link: "",
      isNews: false,
    },
  ]);

  const updateForm = (
    order: number,
    field: keyof PromotionCardData,
    value: string | boolean
  ) => {
    setForms((prev) =>
      prev.map((form) =>
        form.order === order ? { ...form, [field]: value } : form
      )
    );
  };

  const addNewForm = () => {
    if (forms.length < 3) {
      const newForm: PromotionCardData = {
        order: forms.length + 1,
        image: "",
        title: "",
        description: "",
        ctaTitle: "",
        link: "",
        isNews: false,
      };
      setForms((prev) => [...prev, newForm]);
    }
  };

  const removeForm = (order: number) => {
    if (forms.length > 1) {
      setForms((prev) => {
        const filteredForms = prev.filter((form) => form.order !== order);
        // Regenerate order to be sequential
        return filteredForms.map((form, index) => ({
          ...form,
          order: index + 1,
        }));
      });
    }
  };

  const handleImageUpload = (order: number, result: any) => {
    updateForm(order, "image", result.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate minimum forms requirement
    if (forms.length < 2) {
      toast.error("Please create at least 2 promotion cards before saving");
      return;
    }

    // Validate all forms are filled
    if (!allFormsValid) {
      toast.error("Please fill all required fields in all forms");
      return;
    }

    console.log("Promotion Card Data:", forms);

    // Wrap the forms array in a cards property as expected by the controller
    const payload = {
      cards: forms,
    };

    try {
      const response = await createCarouselCard(payload);
      console.log("Carousel Card Data:", response);
      toast.success("Carousel Card created successfully");
    } catch (error: any) {
      console.error("Error creating carousel card:", error);
      toast.error(error || "Failed to create carousel card. Please try again.");
    }
  };

  const isFormValid = (form: PromotionCardData) => {
    return form.image && form.title && form.description;
  };

  const allFormsValid = forms.every(isFormValid);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Promotion Cards
          </h1>
          <p className="text-lg text-gray-600">
            Design and manage promotional content for your platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {forms.map((form, index) => (
            <Card
              key={form.order}
              className="relative bg-white shadow-lg border-0 rounded-xl overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-[#742193] to-[#581770] text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <CardTitle className="text-xl font-semibold text-white">
                      Promotion Card {index + 1}
                    </CardTitle>
                  </div>
                  {forms.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeForm(form.order)}
                      className="text-white hover:bg-white/20 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Image upload and preview */}
                  <div className="flex flex-col items-center w-full lg:w-auto lg:flex-shrink-0">
                    <div className="relative">
                      {form.image ? (
                        <div className="relative group">
                          <Image
                            src={form.image}
                            alt="Promotion Image"
                            className="w-64 h-40 rounded-xl object-cover shadow-md"
                            width={256}
                            height={160}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <div className="flex gap-2">
                              <ReCloudinary
                                id={`image-${form.order}`}
                                initialUrl={form.image}
                                onSuccess={(result) =>
                                  handleImageUpload(form.order, result)
                                }
                                btnClassName="bg-white/90 hover:bg-white hover:text-white text-gray-700 p-2 rounded-lg shadow-lg"
                                btnIcon={<RefreshCcw className="h-4 w-4" />}
                                btnText=""
                                isAlwaysBtn
                                isImgPreview={false}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-lg shadow-lg"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  updateForm(form.order, "image", "");
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-64 h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group">
                          <div className="text-center">
                            <Plus className="h-10 w-10 text-gray-400 mx-auto mb-3 group-hover:text-[#742193] transition-colors" />
                            <p className="text-sm text-gray-500 font-medium">
                              Upload Image
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Click to browse files
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex justify-center">
                        <ReCloudinary
                          id={`image-${form.order}`}
                          initialUrl={form.image}
                          onSuccess={(result) =>
                            handleImageUpload(form.order, result)
                          }
                          btnClassName="bg-[#742193] hover:bg-[#581770] hover:text-white text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          btnIcon={
                            form.image ? (
                              <RefreshCcw className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )
                          }
                          btnText={form.image ? "Change Image" : "Upload Image"}
                          isAlwaysBtn
                          isImgPreview={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title and Description Fields */}
                  <div className="w-full space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor={`title-${form.order}`}
                        className="text-sm font-semibold text-gray-700 flex items-center"
                      >
                        Title/Heading<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`title-${form.order}`}
                        value={form.title}
                        onChange={(e) =>
                          updateForm(form.order, "title", e.target.value)
                        }
                        placeholder="Enter promotion title"
                        className="w-full h-12 text-base border-gray-300 focus:border-[#742193] focus:ring-[#742193] rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor={`description-${form.order}`}
                        className="text-sm font-semibold text-gray-700 flex items-center"
                      >
                        Description<span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`description-${form.order}`}
                        value={form.description}
                        onChange={(e) =>
                          updateForm(form.order, "description", e.target.value)
                        }
                        placeholder="Enter promotion description"
                        className="w-full min-h-[120px] text-base border-gray-300 focus:border-[#742193] focus:ring-[#742193] rounded-lg resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Additional Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CTA Title */}
                    <div className="space-y-3">
                      <Label
                        htmlFor={`ctaTitle-${form.order}`}
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        CTA Title{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id={`ctaTitle-${form.order}`}
                        value={form.ctaTitle}
                        onChange={(e) =>
                          updateForm(form.order, "ctaTitle", e.target.value)
                        }
                        placeholder="Enter call-to-action title"
                        className="w-full h-11 text-base border-gray-300 focus:border-[#742193] focus:ring-[#742193] rounded-lg"
                      />
                    </div>

                    {/* Link */}
                    <div className="space-y-3">
                      <Label
                        htmlFor={`link-${form.order}`}
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Link
                      </Label>
                      <Input
                        id={`link-${form.order}`}
                        type="url"
                        value={form.link}
                        onChange={(e) =>
                          updateForm(form.order, "link", e.target.value)
                        }
                        placeholder="https://example.com"
                        className="w-full h-11 text-base border-gray-300 focus:border-[#742193] focus:ring-[#742193] rounded-lg"
                      />
                    </div>
                  </div>

                  {/* News Checkbox */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`news-${form.order}`}
                        checked={form.isNews}
                        onChange={(e) =>
                          updateForm(form.order, "isNews", e.target.checked)
                        }
                        className="h-5 w-5 text-[#742193] focus:ring-[#742193] border-gray-300 rounded"
                      />
                      <Label
                        htmlFor={`news-${form.order}`}
                        className="text-sm font-semibold text-gray-700 cursor-pointer"
                      >
                        Make this as news
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-8">
                      Check this box if you want to display this as a news item
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Another Form Button */}
          {forms.length < 3 && (
            <Card className="border-dashed border-2 border-gray-300 hover:border-[#742193] transition-all duration-300 hover:shadow-md bg-white">
              <CardContent className="flex items-center justify-center py-12">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewForm}
                  className="flex items-center gap-3 h-14 px-8 text-[#742193] border-[#742193] hover:bg-[#742193] hover:text-white transition-all duration-300 font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Form
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Ready to Save?
                </h3>
                <p className="text-sm text-gray-600">
                  {forms.length} of 3 forms •{" "}
                  {forms.length < 2
                    ? "Minimum 2 forms required"
                    : allFormsValid
                    ? "All forms are valid"
                    : "Please fill required fields"}
                </p>
              </div>
              <Button
                type="submit"
                disabled={!allFormsValid || forms.length < 2}
                className="bg-gradient-to-r from-[#742193] to-[#581770] hover:from-[#581770] hover:to-[#742193] text-white px-8 py-3 h-12 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Promotion Cards
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionCardForm;
