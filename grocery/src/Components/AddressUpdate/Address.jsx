import React, { useState,useEffect } from 'react'
import './Address.css'
import { TextField, Button, Checkbox, FormControlLabel,FormControl, Grid, InputLabel, Select, MenuItem,ToggleButton,ToggleButtonGroup } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import HotelIcon from '@mui/icons-material/Hotel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import addressService from '../../Services/addressService';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
 
const Address = () => {
    const [position, setPosition] = useState([51.505, -0.09]); // Default location
    const [locationName, setLocationName] = useState("Fetching location...");
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        street: '',
        landmark: '',
        area: '',
        buildingName: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        addressType: '',
        isDefault: false,
        deliveryInstructions: '',
      
    })

    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Set user's current position
              setPosition([position.coords.latitude, position.coords.longitude]);
            },
            (err) => {
              setError(err.message);
              console.error("Geolocation error:", err);
            }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
        }
      }, []); // Empty dependency array ensures the effect runs only once      

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value,
        });
      };
    
      const handleSubmit =async (e) => {
        e.preventDefault();
        try{
          const response= await addressService.addAddress(formData,id);
          console.log('Address submitted successfully:', response);
        }catch(error){
          console.error('Error submitting address:', error);

        }
       };
 
  return (
    <div className='address-container'>
        <div>
        <h3>Current Location on OpenStreetMap</h3>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>
              You are here! <br />
              Latitude: {position[0]}, Longitude: {position[1]}
            </Popup>
          </Marker>
        </MapContainer>
      )}
        </div>
        <form onSubmit={handleSubmit} className="address-form">
      <Grid container spacing={2}>
       
      <Grid item xs={12}>
  <ToggleButtonGroup
    value={formData.addressType}
    exclusive
    onChange={(event, newAddressType) => {
      if (newAddressType !== null) {
        handleChange({
          target: { name: 'addressType', value: newAddressType },
        });
      }
    }}
    fullWidth
    required
    className="toggle-button-group"
  >
    <ToggleButton value="Home" className="toggle-button">
      <HomeIcon  sx={{ marginRight: '8px', color: '#e64343' }}/>
      Home
    </ToggleButton>
    <ToggleButton value="Work" className="toggle-button">
      <WorkIcon  sx={{ marginRight: '8px', color: '#e64343' }}/>
      Work
    </ToggleButton>
    <ToggleButton value="Hotel" className="toggle-button">
      <HotelIcon sx={{ marginRight: '8px', color: '#e64343' }}/>
      Hotel
    </ToggleButton>
    <ToggleButton value="Other" className="toggle-button">
      <MoreHorizIcon sx={{ marginRight: '8px', color: '#e64343' }}/>
      Other
    </ToggleButton>
  </ToggleButtonGroup>
</Grid>

  <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Street"
            name="street"
            variant="outlined"
            value={formData.street}
            onChange={handleChange}
            required
          />
          
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Landmark"
            name="landmark"
            variant="outlined"
            value={formData.landmark}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Area"
            name="area"
            variant="outlined"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Building Name"
            name="buildingName"
            variant="outlined"
            value={formData.buildingName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            variant="outlined"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            name="state"
            variant="outlined"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            variant="outlined"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            variant="outlined"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </Grid>
      
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isDefault}
                onChange={handleChange}
                name="isDefault"
                color="primary"
              />
            }
            label="Set as Default Address"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Delivery Instructions"
            name="deliveryInstructions"
            variant="outlined"
            multiline
            rows={4}
            value={formData.deliveryInstructions}
            onChange={handleChange}
           />
        </Grid>
      
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" className='form-button'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
          </div>
   )
}

export default Address