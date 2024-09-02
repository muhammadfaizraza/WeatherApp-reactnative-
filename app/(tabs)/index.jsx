import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import {
  MagnifyingGlassCircleIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import cityData from "../../data/data";
import axios from "axios";

// Mapping of weather conditions to background images
const weatherBackgrounds = {
  clear: require("../../assets/images/clear.jpg"),
  cloudy: require("../../assets/images/cloudy.jpg"),
  rainy: require("../../assets/images/rainy.jpg"),
  snowy: require("../../assets/images/snowy.jpg"),
  sunny: require("../../assets/images/sunny.jpg"),
  // Add more conditions and images as needed
};

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    setFilteredCities(
      cityData?.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCity) {
      const fetchWeatherData = async () => {
        try {
          const response = await axios.get(
            "https://weatherapi-com.p.rapidapi.com/current.json",
            {
              params: { q: `${selectedCity.lat},${selectedCity.lng}` },
              headers: {
                "X-Rapidapi-Key":
                  "3bd9968027mshc8c3e60455caabdp17fa01jsn4be1e1cde10b",
                "X-Rapidapi-Host": "weatherapi-com.p.rapidapi.com",
              },
            }
          );

          const data = response.data;

          const weatherData = {
            location: {
              name: data.location.name,
              country: data.location.country,
            },
            current: {
              temp_c: data.current.temp_c,
              condition: {
                text: data.current.condition.text.toLowerCase(),
              },
              wind_kph: data.current.wind_kph,
              humidity: data.current.humidity,
              last_updated_epoch: data.current.last_updated_epoch,
            },
          };

          setWeatherData(weatherData);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchWeatherData();
    }
  }, [selectedCity]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    toggleSearch(false);
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCitySelect(item)}
      style={[tw`flex-row items-center border-0 p-6 px-4`]}
    >
      <MapPinIcon color="gray" size="20" />
      <Text style={[tw`text-black text-lg ml-2`]}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Determine the background image based on the weather condition
  const getBackgroundImage = () => {
    if (weatherData) {
      const condition = weatherData.current.condition.text;
      if (condition.includes("clear")) return weatherBackgrounds.clear;
      if (condition.includes("cloudy")) return weatherBackgrounds.cloudy;
      if (condition.includes("sunny")) return weatherBackgrounds.sunny;
      if (condition.includes("rain")) return weatherBackgrounds.rainy;
      if (condition.includes("snow")) return weatherBackgrounds.snowy;
      // Default background image
      return require("../../assets/images/bgImage.jpg");
    }
    // bgImage background image
    return require("../../assets/images/bgImage.jpg");
  };

  return (
    <View style={tw`flex-1 relative`}>
      <StatusBar />
      <Image source={getBackgroundImage()} style={tw`absolute h-full w-full`} />
      <SafeAreaView style={tw`flex flex-1 mt-5`}>
        <View style={[tw`mx-4 relative z-50`, styles.customView]}>
          <View style={[tw`flex-row justify-end items-center rounded-full`]}>
            {showSearch ? (
              <TextInput
                placeholder="Search Cities"
                placeholderTextColor={"lightgray"}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                style={[tw`pl-6 h-10 flex-1 text-base text-white`]}
              />
            ) : null}
            <TouchableOpacity
              style={tw`rounded-full p-3 m-1`}
              onPress={() => {
                toggleSearch(!showSearch);
              }}
            >
              <MagnifyingGlassCircleIcon size={25} color="#fff" />
            </TouchableOpacity>
          </View>

          {showSearch && filteredCities?.length > 0 && (
            <View
              style={[
                tw`absolute w-full bg-gray-400 top-16 rounded-3xl`,
                styles.Index,
              ]}
            >
              <FlatList
                data={filteredCities}
                renderItem={renderCityItem}
                keyExtractor={(item) =>
                  item.id ? item.id.toString() : `key-${Math.random()}`
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`p-4`}
                style={styles.flatList}
              />
            </View>
          )}
        </View>

        {/* Main content section */}
        <View style={tw`text-center flex-1 justify-center`}>
          <Text
            style={[
              tw`text-white text-center text-4xl font-bold`,
              { color: "#fff" },
            ]}
          >
            {weatherData ? weatherData.location.name : "Location"}
          </Text>
          <Text
            style={tw`text-white text-center text-2xl font-semibold text-gray-300`}
          >
            {weatherData ? weatherData.location.country : "Country"}
          </Text>
        </View>

        {/* Weather Data at the Bottom */}
        <View style={tw`w-full absolute bottom-4`}>
          <View style={tw`w-full`}>
            <Text style={tw`text-center font-bold text-white text-4xl pt-6`}>
              {weatherData ? Math.round(weatherData.current.temp_c) : "N/A"}°C
            </Text>
            <Text style={tw`text-center font-bold text-white text-2xl`}>
              {weatherData ? weatherData.current.condition.text : "Loading..."}
            </Text>
          </View>
          <View style={tw`flex-row justify-between mx-4 mt-4`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-white font-semibold text-base`}>
                {weatherData ? `${weatherData.current.wind_kph} km/h` : "N/A"}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-white font-semibold text-base`}>
                {weatherData ? `${weatherData.current.humidity}%` : "N/A"}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-white font-semibold text-base`}>
                {weatherData
                  ? new Date(
                      weatherData.current.last_updated_epoch * 1000
                    ).toLocaleTimeString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  customView: {
    height: "7%",
  },
  Index: {
    zIndex: 999,
  },
  flatList: {
    flexGrow: 1,
  },
});
