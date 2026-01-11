import React, { useState, useEffect } from 'react'
import { ProductBrandList } from "../APIRequest/APIRequest"
import { useNavigate } from 'react-router-dom';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();

    const handleBrandClick = (brandID) => {
        navigate(`/products?brand=${brandID}`);
    }

    useEffect(() => {
        (async () => {
            let data = await ProductBrandList();
            if (data && Array.isArray(data)) {
                setBrands(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setBrands(data.data);
            }
        })()
    }, []);


    return (
        <div className="text-center py-15 bg-base-100 text-base-content ">
            {!brands[0] ?
                <>
                    <div className="mb-6 flex justify-center items-center">
                        <div className="skeleton h-8 w-100"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 m-3">
                                <div className="skeleton h-25 w-25 shrink-0 rounded-full"></div>
                                <div className="skeleton h-4 w-20"></div>
                            </div>
                        ))}
                    </div>
                </>
                :
                <>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Select Your Brand</h2>
                        <hr className="h-[2px] border-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent w-1/3 mx-auto" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        {brands.map((brand) => (
                            <div
                                key={brand['_id']}
                                className="flex flex-col m-3 items-center cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => handleBrandClick(brand['_id'])}
                            >
                                <img src={brand.brandImg} alt={brand.brandName} className=" w-25 h-25 mb-2 rounded-full object-scale-down bg-gray-200 shadow-md" />
                                <h5 className="text-center font-medium">{brand.brandName}</h5>
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

export default BrandList