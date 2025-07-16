import { useEffect, useState } from "react";
import DailySummary from "./components/DailySummary/DailySummary";
import ScanSection from "./components/ScanSection/ScanSection";
import DailyLog from "./components/DailyLog/DailyLog";
import FoodAnalysisModal from "./components/FoodAnalysisModal/FoodAnalysisModal";
import LogSummaryModal from "./components/LogSummaryModal/LogSummaryModal";
import CameraModal from "./components/CameraModal/CameraModal";
import "./dashboard.css";
import "./animation.css";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import DailyLogModal from "./components/DailyLog/DailyLogModal";


function NewDashboard() {
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [ShowDailyLogModal, setDailyLogModal] = useState(false);
  const [foodData, setFoodData] = useState(null);
  const [calorieData, setCalorieData] = useState({});
  const [loggedItems, setLoggedItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [Items, setItems] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [slectedDate, setSelectedDate] = useState("");


  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(
        ".slide-up, .slide-left, .slide-right, .scale-animation"
      )
      .forEach((el) => {
        observer.observe(el);
      });

    return () => {
      observer.disconnect();
    };
  }, []);



  const fetchTodaysSummary = async () => {
    try {
      const { data } = await axiosInstance.get(`/food/log/daily/${today}`);
      setCalorieData(data?.summary ?? {});
      setItems(data?.items);
    } catch (error) {
      toast.error(error.message ?? "Failed to fetch calorie data.");
    }
  };

  useEffect(() => {
    fetchTodaysSummary();
  }, [loggedItems]);

  const handleFileUpload = async (e) => {
    if (e.target.files.length > 0) {
      // Process image would go here
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      console.log("formData==", formData);
      try {
        setUploading(true);
        const response = await axiosInstance.post(
          "/calorie/analyze",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (!response.data?.items || response.data?.items.length === 0) {
          toast.error("No food items detected. Try another image.");
          return;
        }
        setFoodData(response.data);
        setShowFoodModal(true);
        toast.success(`Upload success`);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddToLog = async (consumedGrams, meal_type) => {
    console.log(consumedGrams, meal_type);
    const items = foodData.items.map((item, index) => ({
      ...item, // preserve all existing properties as-is
      weight_grams: Number(consumedGrams[item.name] || 0),
    }));

    const payload = {
      meal_type,
      items,
    };

    try {
      const response = await axiosInstance.post("/food/log/batch", payload);
      setLoggedItems(response?.data);
      toast.success("Consumed data submitted successfully!");
      setShowFoodModal(false);
      setShowLogModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit consumed data.");
    }
  };

  const getSampleFoodData = () => ({
    items: [
      {
        name: "Pineapple",
        calories_per_gram: 0.5,
        nutrients: {
          protein_g: 0.5,
          carbohydrates_g: 10.0,
          fats_g: 0.1,
        },
      },
      {
        name: "Grilled Chicken",
        calories_per_gram: 1.65,
        nutrients: {
          protein_g: 25.0,
          carbohydrates_g: 0.0,
          fats_g: 3.0,
        },
      },
      {
        name: "Mixed Greens",
        calories_per_gram: 0.15,
        nutrients: {
          protein_g: 1.0,
          carbohydrates_g: 3.0,
          fats_g: 0.2,
        },
      },
    ],
    total_calories: 420,
    tips: "This fruit plate is already a healthy option. For better macros balance, consider adding a protein source like Greek yogurt or nuts.",
  });

  return (
    <div className="app">
      {/* Background Elements */}
      <div className="bg-blur-1"></div>
      <div className="bg-blur-2"></div>

      {/* <Header /> */}

      <main className="dashboard-container">
        <div className="container">
          <DailySummary calorieData={calorieData} />
          <ScanSection
            onOpenCamera={() => setShowCameraModal(true)}
            onFileUpload={handleFileUpload}
            uploadStatus={uploading}
            items={Items}
          />
          <DailyLog
            OpenDailyLogModal={() => setDailyLogModal(true)}
            setSelectedDate={setSelectedDate}
            logNotifier={loggedItems}
          />
        </div>
      </main>

      {/* Modals */}
      {showFoodModal && (
        <FoodAnalysisModal
          foodData={foodData}
          onClose={() => setShowFoodModal(false)}
          onAddToLog={handleAddToLog}
        />
      )}

      {showLogModal && (
        <LogSummaryModal
          foodItems={loggedItems}
          onClose={() => setShowLogModal(false)}
        />
      )}

      {ShowDailyLogModal && (
        <DailyLogModal
          isVisible={ShowDailyLogModal}
          selectedDate={slectedDate}
          onClose={() => setDailyLogModal(false)}
        />
      )}

      {showCameraModal && (
        <CameraModal
          onClose={() => setShowCameraModal(false)}
          onCapture={() => {
            setShowCameraModal(false);
            setFoodData(getSampleFoodData());
            setShowFoodModal(true);
          }}
        />
      )}

     
    </div>
  );
}

export default NewDashboard;
