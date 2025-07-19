import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { UserTryCatch } from "@/middleware/TryCatch";
import User from "@/model/user";

export const PUT = UserTryCatch(async (req) => {
  const {
    phone,
    name,
    landmark,
    city,
    state,
    country = "India",
    zipCode,
    isDefault = false,
  } = await req.json();

  if (!name || !phone || !city || !state || !zipCode) {
    return failedResponse("Please provide all required address fields!");
  }

  const user = await User.findById(req.id);

  if (!user) {
    return failedResponse("User not found!");
  }

  if (isDefault) {
    // Set all existing addresses as non-default
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push({
    phone,
    name,
    landmark,
    city,
    state,
    country,
    zipCode,
    isDefault,
  });

  await user.save();

  return ResponseSuccess("Address added successfully!", user.addresses);
});

export const PATCH = UserTryCatch(async (req) => {
  const {
    id,
    phone,
    name,
    landmark,
    city,
    state,
    country = "India",
    zipCode,
    isDefault = false,
  } = await req.json();

  if (!id || !name || !phone || !city || !state || !zipCode) {
    return failedResponse("Please provide all required fields including address id!");
  }

  const user = await User.findById(req.id);

  if (!user) {
    return failedResponse("User not found!");
  }

  const address = user.addresses.id(id);

  if (!address) {
    return failedResponse("Address not found!");
  }

  // If isDefault is true, unset other addresses as default
  if (isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  // Update address fields
  address.phone = phone;
  address.name = name;
  address.landmark = landmark;
  address.city = city;
  address.state = state;
  address.country = country;
  address.zipCode = zipCode;
  address.isDefault = isDefault;

  await user.save();

  return ResponseSuccess("Address updated successfully!", user.addresses);
});


export const DELETE = UserTryCatch(async (req) => {
  const { id } = await req.json();

  if (!id) {
    return failedResponse("Please provide an address ID!");
  }

  const user = await User.findById(req.id);

  if (!user) {
    return failedResponse("User not found!");
  }

  const initialLength = user.addresses.length;

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== id
  );

  if (user.addresses.length === initialLength) {
    return failedResponse("Address not found!");
  }

  await user.save();

  return ResponseSuccess("Address deleted successfully!", user.addresses);
});
