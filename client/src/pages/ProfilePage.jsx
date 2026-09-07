import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { ReadProfile, UpdateProfile, checkToken } from '../APIRequest/APIRequest'
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai'
import Layout from '../layout/Layout'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [isEditingDelivery, setIsEditingDelivery] = useState(false)
  const [userForm, setUserForm] = useState({})
  const [deliveryForm, setDeliveryForm] = useState({})

  useEffect(() => {
    (async () => {
      const auth = await checkToken();
      if (!auth?.validation) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }
      setIsAuthenticated(true)

      const userData = await ReadProfile()
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
  }, [])

  const handleUserEdit = () => {
    setIsEditingUser(!isEditingUser)
  }

  const handleUserSave = async () => {
    const updatedUser = { ...user, ...userForm }
    const result = await UpdateProfile(updatedUser)
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
    const result = await UpdateProfile(updatedUser)
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

  if (loading) return <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p className="text-base-content/60">Loading your profile...</p></div></Layout>
  if (!isAuthenticated) return <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p>Please login to view your profile.</p></div></Layout>

  return (
    <Layout>
      <main className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-widest text-primary">Account center</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your profile</h1><p className="mt-2 text-base-content/60">Keep your contact and delivery information up to date.</p></div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-base-300 pb-5"><div><p className="text-sm text-primary">Personal details</p><h2 className="mt-1 text-2xl font-semibold">User information</h2></div><span className="rounded-full bg-base-200 px-3 py-1 text-xs text-base-content/60">Private</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-base-content/60">Name</label>
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

        <div className="mt-6 rounded-2xl border border-base-300 bg-base-200 p-6 text-center sm:p-8">
          <p className="text-sm text-primary">Delivery preferences</p><h2 className="mt-1 text-xl font-semibold">Where should we deliver?</h2><p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">Review or update the shipping address used for your orders.</p>
          <button onClick={() => setShowDeliveryModal(true)} className="mt-5 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-content transition hover:brightness-110">
            Manage delivery address
          </button>
        </div>

        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-2xl shadow-2xl max-w-md w-[calc(100%-2rem)] relative">
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
      </main>
    </Layout>
  )
}

export default ProfilePage