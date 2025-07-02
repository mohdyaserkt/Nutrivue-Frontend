import { useEffect, useState } from "react";
import { ImageUpload } from "../../components/PrivateLayout/Dashboard/ImageUpload";
import { DetailsModal } from "../../components/PrivateLayout/Dashboard/DetailsModal";
import { useSelector } from "react-redux";
import { CalorieChart } from "../../components/PrivateLayout/Dashboard/CalorieChart";
export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  console.log("user===", user);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const REQUIRED_KEYS = [
    "name",
    "age",
    "gender",
    "weight_kg",
    "height_cm",
    "activity_level",
    "goal",
    "target_calories",
    "email",
  ];
  const isModalOpen = !REQUIRED_KEYS.every((key) => {
    const value = user?.[key];
    return value !== null && value !== undefined && value !== "";
  });

  useEffect(() => {
    console.log("isModalOpen==", isModalOpen);

    setOpen(isModalOpen);
  }, [isModalOpen]);
  return (
    <>
      <CalorieChart isSubmitted={isSubmitted} />
      <ImageUpload setIsSubmitted={setIsSubmitted} isSubmitted={isSubmitted} />

      {<DetailsModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
