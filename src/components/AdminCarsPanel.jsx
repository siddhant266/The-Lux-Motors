import React, { useState, useEffect } from 'react';
import { styled } from '@stitches/react';
import { fetchAllCars, createCar, updateCar, deleteCar } from '../api/cars';
import { useAuth } from '../context/AuthContext';

// Stitches Styled Components
const Container = styled('div', {
  padding: '20px',
  color: '#e5e2e1',
  fontFamily: '"Montserrat", sans-serif',
});

const TopBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
});

const Title = styled('h2', {
  fontFamily: '"Playfair Display", serif',
  fontSize: '24px',
  fontWeight: 300,
  margin: 0,
});

const Button = styled('button', {
  padding: '10px 20px',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  border: '1px solid rgba(189,165,136,0.3)',
  color: '#bda588',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(189,165,136,0.1)',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '#bda588',
        color: '#080808',
        '&:hover': {
          backgroundColor: '#d0b99f',
        },
      },
      danger: {
        color: '#f87171',
        borderColor: 'rgba(248,113,113,0.3)',
        '&:hover': {
          backgroundColor: 'rgba(248,113,113,0.1)',
        },
      },
    },
  },
});

const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
});

const Th = styled('th', {
  paddingBottom: '16px',
  paddingRight: '24px',
  fontSize: '9px',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: '#555',
  fontWeight: 'normal',
  borderBottom: '1px solid #1a1a1a',
});

const Td = styled('td', {
  padding: '20px 24px 20px 0',
  fontSize: '13px',
  color: '#e5e2e1',
  borderBottom: '1px solid #111',
});

const FormContainer = styled('div', {
  backgroundColor: '#0a0a0a',
  border: '1px solid #1a1a1a',
  padding: '30px',
  marginTop: '20px',
});

const FormGroup = styled('div', {
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
});

const Label = styled('label', {
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#888',
  marginBottom: '8px',
});

const Input = styled('input', {
  backgroundColor: '#111',
  border: '1px solid #333',
  color: '#e5e2e1',
  padding: '12px 16px',
  fontSize: '13px',
  outline: 'none',
  '&:focus': {
    borderColor: '#bda588',
  },
});

const Textarea = styled('textarea', {
  backgroundColor: '#111',
  border: '1px solid #333',
  color: '#e5e2e1',
  padding: '12px 16px',
  fontSize: '13px',
  minHeight: '100px',
  outline: 'none',
  '&:focus': {
    borderColor: '#bda588',
  },
});

const CheckboxGroup = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
});

export default function AdminCarsPanel() {
  const { token } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', year: '', description: '',
    engine: '', topSpeed: '', acceleration: '', seats: '',
    fuelType: '', priceDisplay: '', price: '', images: '', isFeatured: false
  });

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCars();
      setCars(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const openNewForm = () => {
    setFormData({
      name: '', brand: '', category: '', year: '', description: '',
      engine: '', topSpeed: '', acceleration: '', seats: '',
      fuelType: '', priceDisplay: '', price: '', images: '', isFeatured: false
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (car) => {
    setFormData({
      ...car,
      topSpeed: car.topSpeed || '',
      fuelType: car.fuelType || '',
      priceDisplay: car.priceDisplay || '',
      images: car.images ? car.images.join(', ') : '',
      year: car.year || '',
      seats: car.seats || '',
      price: car.price || '',
      isFeatured: car.isFeatured || false,
    });
    setEditingId(car.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      await deleteCar(id, token);
      setCars(cars.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year) || undefined,
        seats: parseInt(formData.seats) || undefined,
        price: parseInt(formData.price) || undefined,
        top_speed: formData.topSpeed,
        fuel_type: formData.fuelType,
        price_display: formData.priceDisplay,
        is_featured: formData.isFeatured,
        images: formData.images.split(',').map(url => url.trim()).filter(Boolean)
      };

      if (editingId) {
        await updateCar(editingId, payload, token);
      } else {
        await createCar(payload, token);
      }
      setIsFormOpen(false);
      loadCars();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Container>Loading inventory...</Container>;

  return (
    <Container>
      {!isFormOpen ? (
        <>
          <TopBar>
            <Title>Car Inventory</Title>
            <Button variant="primary" onClick={openNewForm}>+ Add Vehicle</Button>
          </TopBar>
          <Table>
            <thead>
              <tr>
                <Th>Vehicle</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Featured</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {car.images?.[0] && (
                        <img src={car.images[0]} alt={car.name} style={{ width: '60px', height: '40px', objectFit: 'cover' }} />
                      )}
                      <div>
                        <div style={{ color: '#bda588' }}>{car.name}</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>{car.brand}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{car.category}</Td>
                  <Td>{car.priceDisplay}</Td>
                  <Td>{car.isFeatured ? 'Yes' : 'No'}</Td>
                  <Td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button onClick={() => openEditForm(car)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(car.id)}>Delete</Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <FormContainer>
          <TopBar>
            <Title>{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</Title>
            <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          </TopBar>
          <form onSubmit={handleSubmit}>
            <Grid>
              <FormGroup>
                <Label>Name *</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Brand</Label>
                <Input name="brand" value={formData.brand} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>Category</Label>
                <Input name="category" value={formData.category} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>Year</Label>
                <Input type="number" name="year" value={formData.year} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>Price Display (e.g. $950,000)</Label>
                <Input name="priceDisplay" value={formData.priceDisplay} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>Numeric Price (for sorting)</Label>
                <Input type="number" name="price" value={formData.price} onChange={handleChange} />
              </FormGroup>
            </Grid>

            <FormGroup>
              <Label>Description</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </FormGroup>

            <Grid>
              <FormGroup>
                <Label>Engine</Label>
                <Input name="engine" value={formData.engine} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>Top Speed</Label>
                <Input name="topSpeed" value={formData.topSpeed} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>0-60 mph (Acceleration)</Label>
                <Input name="acceleration" value={formData.acceleration} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>Seats</Label>
                <Input type="number" name="seats" value={formData.seats} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>Fuel Type</Label>
                <Input name="fuelType" value={formData.fuelType} onChange={handleChange} />
              </FormGroup>
            </Grid>

            <FormGroup>
              <Label>Images (comma-separated URLs)</Label>
              <Textarea name="images" value={formData.images} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <CheckboxGroup>
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                <Label htmlFor="isFeatured" style={{ marginBottom: 0 }}>Featured Vehicle</Label>
              </CheckboxGroup>
            </FormGroup>

            <Button variant="primary" type="submit">Save Vehicle</Button>
          </form>
        </FormContainer>
      )}
    </Container>
  );
}
