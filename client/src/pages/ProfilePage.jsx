import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { readCookie } from '../helper/cookie'
import { ReadProfile, UpdateProfile } from '../APIRequest/APIRequest'
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai'
import Layout from '../layout/Layout'

const ProfilePage = () => {
  const token = readCookie("token")
  console.log("Token read from cookie:", token)
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoYWhyaWFyQGdtYWlsLmNvbSIsInVzZXJfaWQiOiI2OGJkOWViMjk0NWRiZjhjOTAwMzVlZTgiLCJpYXQiOjE3Njc5NTcyOTksImV4cCI6MTc2ODA0MzY5OX0.x1YHmkJupCE8E2ttKJg3O7EX1NEG7WSYEId7zbRZnko"
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [isEditingDelivery, setIsEditingDelivery] = useState(false)
  const [userForm, setUserForm] = useState({})
  const [deliveryForm, setDeliveryForm] = useState({})

  useEffect(() => {
    if (!token) {
      console.log("No token found in cookie")
      return
    }
    (async () => {
      const userData = await ReadProfile(token)
      console.log("ReadProfile response:", userData)
      if (userData && userData.status === 'success') {
        const profileData = userData.data || {}
        setUser(profileData)
        setUserForm({
          cus_name: profileData.cus_name || '',
          cus_phone: profileData.cus_phone || '',
          cus_fax: profileData.cus_fax || '',
          cus_add: profileData.cus_add || '',
          cus_city: profileData.cus_city || '',
          cus_state: profileData.cus_state || '',
          cus_postcode: profileData.cus_postcode || '',
          cus_country: profileData.cus_country || '',
        })
        setDeliveryForm({
          ship_name: profileData.ship_name || '',
          ship_phone: profileData.ship_phone || '',
          ship_add: profileData.ship_add || '',
          ship_city: profileData.ship_city || '',
          ship_state: profileData.ship_state || '',
          ship_postcode: profileData.ship_postcode || '',
          ship_country: profileData.ship_country || '',
        })
      }
      setLoading(false)
    })()
  }, [token])

  const handleUserEdit = () => {
    setIsEditingUser(!isEditingUser)
  }

  const handleUserSave = async () => {
    const updatedUser = { ...user, ...userForm }
    const result = await UpdateProfile(updatedUser, token)
    if (result) {
      setUser(updatedUser)
      setIsEditingUser(false)
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  }

  const handleDeliveryEdit = () => {
    setIsEditingDelivery(!isEditingDelivery)
  }

  const handleDeliverySave = async () => {
    const updatedUser = { ...user, ...deliveryForm }
    const result = await UpdateProfile(updatedUser, token)
    if (result) {
      setUser(updatedUser)
      setIsEditingDelivery(false)
      toast.success("Shipping address updated successfully!");
    } else {
      toast.error("Failed to update shipping address");
    }
  }

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value })
  }

  const handleDeliveryChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value })
  }

  if (!token) return <div>Please login to view your profile.</div>
  if (loading) return <div>Loading...</div>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-base-100 text-base-content">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="bg-base-200 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              {isEditingUser ? (
                <input type="text" name="cus_name" value={userForm.cus_name} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              {isEditingUser ? (
                <input type="text" name="cus_phone" value={userForm.cus_phone} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Fax</label>
              {isEditingUser ? (
                <input type="text" name="cus_fax" value={userForm.cus_fax} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_fax}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              {isEditingUser ? (
                <input type="text" name="cus_add" value={userForm.cus_add} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_add}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              {isEditingUser ? (
                <input type="text" name="cus_city" value={userForm.cus_city} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              {isEditingUser ? (
                <input type="text" name="cus_state" value={userForm.cus_state} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Postcode</label>
              {isEditingUser ? (
                <input type="text" name="cus_postcode" value={userForm.cus_postcode} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_postcode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              {isEditingUser ? (
                <input type="text" name="cus_country" value={userForm.cus_country} onChange={handleUserChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
              ) : (
                <p className="text-base-content">{user.cus_country}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            {isEditingUser ? (
              <button onClick={handleUserSave} className="bg-primary hover:bg-primary text-primary-content py-2 px-4 rounded">
                Save
              </button>
            ) : (
              <button onClick={handleUserEdit} className="bg-secondary hover:bg-secondary text-secondary-content py-2 px-4 rounded flex items-center gap-2">
                <AiOutlineEdit /> Edit
              </button>
            )}
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => setShowDeliveryModal(true)} className="bg-accent hover:bg-accent text-accent-content py-2 px-4 rounded">
            Delivery Option
          </button>
        </div>

        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <button onClick={() => setShowDeliveryModal(false)} className="absolute top-2 right-2 text-base-content hover:text-error">
                <AiOutlineClose size={24} />
              </button>
              <h2 className="text-2xl font-semibold mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  {isEditingDelivery ? (
                    <input type="text" name="ship_name" value={deliveryForm.ship_name} onChange={handleDeliveryChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                  ) : (
                    <p className="text-base-content">{user.ship_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  {isEditingDelivery ? (
                    <input type="text" name="ship_phone" value={deliveryForm.ship_phone} onChange={handleDeliveryChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                  ) : (
                    <p className="text-base-content">{user.ship_phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Address</label>
                  {isEditingDelivery ? (
                    <input type="text" name="ship_add" value={deliveryForm.ship_add} onChange={handleDeliveryChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                  ) : (
                    <p className="text-base-content">{user.ship_add}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">City</label>
                  {isEditingDelivery ? (
                    <input type="text" name="ship_city" value={deliveryForm.ship_city} onChange={handleDeliveryChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                  ) : (
                    <p className="text-base-content">{user.ship_city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  {isEditingDelivery ? (
                    <input type="text" name="ship_state" value={deliveryForm.ship_state} onChange={handleDeliveryChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                  ) : (
                    <p className="text-base-content">{user.ship_state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Postcode</label>
                  {isEditingDelivery ? (
                    <input type="text" name="ship_postcode" value={deliveryForm.ship_postcode} onChange={handleDeliveryChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                  ) : (
                    <p className="text-base-content">{user.ship_postcode}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Country</label>
                  {isEditingDelivery ? (
                    <input type="text" name="ship_country" value={deliveryForm.ship_country} onChange={handleDeliveryChange} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                  ) : (
                    <p className="text-base-content">{user.ship_country}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center">
                {isEditingDelivery ? (
                  <button onClick={handleDeliverySave} className="bg-primary hover:bg-primary text-primary-content py-2 px-4 rounded">
                    Save
                  </button>
                ) : (
                  <button onClick={handleDeliveryEdit} className="bg-secondary hover:bg-secondary text-secondary-content py-2 px-4 rounded flex items-center gap-2">
                    <AiOutlineEdit /> Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ProfilePage