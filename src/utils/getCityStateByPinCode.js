import axios from "axios";

export const getCityStateByPinCode = async (
  pincode = "700131",
  setcity = () => {},
  setstate = () => {}
) => {
  if (!pincode) return;

  if (pincode.length === 6) {
    console.log("calling api");
    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
        // {
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //   },
        // }
      );
      console.log(res);
      const data =  res.data[0];
      if (data.Status === "Success") {
        setcity(data.PostOffice[0].Region);
        setstate(data.PostOffice[0].State);
      }
    } catch (error) {
      console.log(error);
    }

    //   .then((data) => {
    //     console.log(data);
    //     if (data[0].Status === "Success") {
    //       this.city = data[0].PostOffice[0].District;
    //       this.state = data[0].PostOffice[0].State;
    //       this.invalidTxt = "";
    //     }
    //     if (data[0].Status === "Error") {
    //       console.log("Pincode not found");
    //       this.city = "";
    //       this.state = "";
    //       this.invalidTxt = "Invalid Pincode or Pincode not found";
    //     }
    //   });
  }
};
