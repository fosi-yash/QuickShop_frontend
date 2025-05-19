import React from 'react'
import { getTokenWithExpiry } from '../../../utils/auth';
import { useNavigate } from 'react-router';

const ProductEdit = async () => {
    const navigate = useNavigate()
    const token = await getTokenWithExpiry('token');
    const role = await getTokenWithExpiry('role')
    if (role !== 'admin' || !token) {
        return navigate('/login')
    }

    return (
        <div>
            <div className="container mt-5">
                <h2 className="mb-4">Product List</h2>
                <table className="table table-bordered table-hover align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Product Name</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Apple iPhone 15</td>
                            <td><img src="https://via.placeholder.com/100" alt="iPhone 15" className="img-fluid rounded" width="100" /></td>
                            <td>₹75,000</td>
                            <td>10</td>
                            <td>Electronics</td>
                        </tr>
                        <tr>
                            <td>Nike Running Shoes</td>
                            <td><img src="https://via.placeholder.com/100" alt="Nike Shoes" className="img-fluid rounded" width="100" /></td>
                            <td>₹4,500</td>
                            <td>20</td>
                            <td>Footwear</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductEdit
