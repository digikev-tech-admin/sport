"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ReCloudinary from "../cloudinary/ReCloudinary";
import { Plus, X, RefreshCcw, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  createCarouselCard,
  getCarouselCardById,
  updateCarouselCard,
} from "@/api/promotion";
import Loader from "../shared/Loader";
import { useRouter } from "next/navigation";

interface PromotionCardData {
  order: number;
  image: string;
  title: string;
  description: string;
  ctaTitle: string;
  link: string;
  isNews: boolean;
}

const PromotionCardForm = ({
  id,
  isEditing,
  setIsEditing,
}: {
  id: string;
  isEditing: boolean;
  setIsEditing?: (isEditing: boolean) => void;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [isActive, setIsActive] = useState(true);
  const [previewForm, setPreviewForm] = useState<PromotionCardData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  useEffect(() => {
    if (id) {
      setLoading(true);

      const fetchPromotionCard = async () => {
        try {
          const response = await getCarouselCardById(id);
          // console.log({response});

          // Set the forms with the fetched data
          if (response?.cards) {
            setForms(response.cards);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchPromotionCard();
    }
  }, [id]);

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

  const handlePreview = (form: PromotionCardData) => {
    setPreviewForm(form);
    setIsPreviewOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Validate minimum forms requirement
    if (forms.length < 1) {
      toast.error("Please create at least 1 promotion card before saving");
      return;
    }

    // Validate all forms are filled
    if (!allFormsValid) {
      toast.error("Please fill all required fields in all forms");
      return;
    }

    // console.log("Promotion Card Data:", forms);

    // Wrap the forms array in a cards property as expected by the controller
    const payload = {
      cards: forms,
      isActive: isActive,
    };

    try {
      if (id) {
        const response = await updateCarouselCard(id, payload);
        console.log("Carousel Card Data:", response);
        toast.success("Carousel Card updated successfully");
        setIsEditing?.(false);
        router.push(`/promotion/editPromotionCard/${id}/#promotion-card-form`);
      } else {
        const response = await createCarouselCard(payload);
        console.log("Carousel Card Data:", response);
        toast.success("Carousel Card created successfully");
        router.push(`/promotion?tab=promotions_cards`);
      }
    } catch (error: any) {
      console.error("Error creating carousel card:", error);
      toast.error(error || "Failed to create carousel card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = (form: PromotionCardData) => {
    return form.title && form.description;
  };

  // console.log({forms});

  const allFormsValid = forms.every(isFormValid);

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="promotion-card-form" className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(form)}
                      className="text-white hover:bg-white/20 hover:text-white"
                      title="Preview Card"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    {forms.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={forms.length === 1 || !isEditing}
                        onClick={() => removeForm(form.order)}
                        className="text-white hover:bg-white/20 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                          disabled={!isEditing}
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
                        disabled={!isEditing}
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
                        disabled={!isEditing}
                        onChange={(e) =>
                          updateForm(form.order, "description", e.target.value)
                        }
                        placeholder="Enter promotion description"
                        className="w-full min-h-[120px] text-base border-gray-300 focus:border-[#742193] focus:ring-[#742193] rounded-lg resize-none"
                      />
                    </div>
                  </div>
                </div>

                 {/* News Checkbox */}
                 <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`news-${form.order}`}
                        checked={form.isNews}
                        onChange={(e) => {
                          const isNews = e.target.checked;
                          updateForm(form.order, "isNews", isNews);
                          // Clear CTA Title and Link when news is selected
                          if (isNews) {
                            updateForm(form.order, "ctaTitle", "");
                            updateForm(form.order, "link", "");
                          }
                        }}
                        disabled={!isEditing}
                        className="h-5 w-5 text-[#742193] focus:ring-[#742193] border-gray-300 rounded cursor-pointer"
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

                {/* Additional Fields */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CTA Title */}
                    <div className="space-y-3">
                      <Label
                        htmlFor={`ctaTitle-${form.order}`}
                        className={`text-sm font-semibold flex items-center gap-2 ${
                          form.isNews ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        CTA Title{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id={`ctaTitle-${form.order}`}
                        value={form.ctaTitle}
                        disabled={!isEditing || form.isNews}
                        onChange={(e) =>
                          updateForm(form.order, "ctaTitle", e.target.value)
                        }
                        placeholder={form.isNews ? "Not applicable for news items" : "Enter call-to-action title"}
                        className={`w-full h-11 text-base border-gray-300 focus:border-[#742193] focus:ring-[#742193] rounded-lg ${
                          form.isNews ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    {/* Link */}
                    <div className="space-y-3">
                      <Label
                        htmlFor={`link-${form.order}`}
                        className={`text-sm font-semibold flex items-center gap-2 ${
                          form.isNews ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          form.isNews ? "bg-gray-400" : "bg-green-500"
                        }`}></span>
                        Link
                      </Label>
                      <Input
                        id={`link-${form.order}`}
                        type="url"
                        value={form.link}
                        disabled={!isEditing || form.isNews}
                        onChange={(e) =>
                          updateForm(form.order, "link", e.target.value)
                        }
                        placeholder={form.isNews ? "Not applicable for news items" : "https://example.com"}
                        className={`w-full h-11 text-base border-gray-300 focus:border-[#742193] focus:ring-[#742193] rounded-lg ${
                          form.isNews ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>

                 
                </div>
              </CardContent>
            </Card>
          ))}

          {/* <div className="mt-5 border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                disabled={!isEditing}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 text-[#742193] focus:ring-[#742193] border-gray-300 rounded"
              />
              <Label
                htmlFor="isActive"
                className="text-sm font-semibold text-gray-700 cursor-pointer"
              >
                Active Status
              </Label>
            </div>
          </div> */}

          {/* Add Another Form Button */}
          {forms.length < 3 && (
            <Card className="border-dashed border-2 border-gray-300 hover:border-[#742193] transition-all duration-300 hover:shadow-md bg-white">
              <CardContent className="flex items-center justify-center py-12">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewForm}
                  className="flex items-center gap-3 h-14 px-8 text-[#742193] border-[#742193] hover:bg-[#742193] hover:text-white transition-all duration-300 font-semibold"
                  disabled={!isEditing}
                >
                  <Plus className="h-5 w-5" />
                  Add Another Form
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                type="submit"
                disabled={
                  !allFormsValid || forms.length < 1 || loading || !isEditing
                }
                className="flex-1 bg-gradient-to-r from-[#742193] to-[#581770] hover:from-[#581770] hover:to-[#742193] text-white px-8 py-3 h-12 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && id
                  ? "Updating..."
                  : isSubmitting
                  ? "Submitting..."
                  : isEditing && id
                  ? "Update Promotion Cards"
                  : "Save Promotion Cards"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
                onClick={() => {
                  if (isEditing && id) {
                    if (setIsEditing) {
                      setIsEditing(false);
                      router.push(
                        `/promotion/editPromotionCard/${id}?/#promotion-card-form`
                      );
                    }
                    return;
                  }
                  setForms([
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

                  router.push(`/promotion?tab=promotions_cards`);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
            <div className="text-center sm:text-left mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Ready to Save?
              </h3>
              <p className="text-sm text-gray-600">
                {forms.length} of 3 forms •{" "}
                {forms.length < 1
                  ? "Minimum 1 form required"
                  : allFormsValid
                  ? "All forms are valid"
                  : "Please fill required fields"}
              </p>
            </div>
          </div>
        </form>

        {/* Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="!w-[90%] sm:!w-[40%]  h-[60vh]  overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Preview Promotion Card
              </DialogTitle>
            </DialogHeader>
            {previewForm && (
              <div className="mt-4">
                {/* Banner Preview */}
                <div className={`rounded-xl overflow-hidden shadow-lg ${
                  previewForm.isNews ? "bg-[#f4b943]" : "bg-[#f4b943]"
                }`}>
                  <div className="flex flex-row min-h-[200px]">
                    {/* Left Side - Content */}
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <div className="space-y-2">
                        {/* News Badge */}
                        {previewForm.isNews && (
                          <div className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-white text-xs font-medium mb-2">
                            📰 NEWS
                          </div>
                        )}
                        
                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                          {previewForm.title || (previewForm.isNews ? "News Title" : "Promotion Title")}
                        </h2>
                        
                        {/* Description */}
                        <p className="text-gray-700 text-xs sm:text-base lg:text-lg leading-relaxed">
                          {previewForm.description || (previewForm.isNews ? "News description will appear here" : "Promotion description will appear here")}
                        </p>
                        
                        {/* CTA Button - Only show if not news and has CTA title */}
                        {!previewForm.isNews && previewForm.ctaTitle && (
                          <div className="pt-2">
                            <a
                              href={previewForm.link || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-white text-gray-800 px-1 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 transition-colors shadow-md"
                            >
                              {previewForm.ctaTitle}
                              <span className="text-lg">→</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right Side - Image */}
                    <div className="w-[50%] overflow-hidden flex-shrink-0 p-2 sm:p-6 flex items-center justify-center">
                      {previewForm.image ? (
                        <div className="relative w-full overflow-hidden rounded-xl flex items-center justify-center">
                          <Image
                            src={previewForm.image}
                            alt={previewForm.isNews ? "News Preview" : "Promotion Preview"}
                            width={300}
                            height={200}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 lg:h-64 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                          <div className="text-center text-gray-500">
                            <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                              <span className="text-2xl">📷</span>
                            </div>
                            <p className="text-sm font-medium">No image uploaded</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {previewForm.isNews ? "Image is optional for news items" : "Upload an image to see preview"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                
                 
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PromotionCardForm;
