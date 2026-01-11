import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import { ProductSliderList } from '../APIRequest/APIRequest'

const PtoductSlider = () => {
    const [sliderData, setSliderData] = useState([])

    useEffect(() => {
        (async () => {
            let data = await ProductSliderList()
            if (data && data.data) {
                setSliderData(data.data)
            }
        })()
    }, [])

    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <Swiper
                modules={[Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="w-full"
            >
                {sliderData.map((item) => (
                    <SwiperSlide key={item._id}>
                        {console.log("Slider data:"+item)}
                        <Link to={`/product/${item.productID}`}>
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default PtoductSlider