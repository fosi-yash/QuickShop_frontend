import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/admin/User.css"; // Custom styles if needed
import { useAdmin } from "./AdminContext";

const User = () => {

    const { user, userBlock, fetchusers } = useAdmin()




    return (
        <div className="user-page-main-div">
            <div className="container  my-5">
                <h2 className="mb-4 user-page-h2 text-center">All Users</h2>


                <div className="table-responsive">
                    <table className="table user-page-table text-center table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>Role</th>
                                <th>*</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((user, index) => (
                                <tr key={user._id}>
                                    <td style={{ color: user.block && "red" }} >{index + 1}</td>
                                    <td style={{ color: user.block && "red" }} >{user.name}</td>
                                    <td style={{ color: user.block && "red" }} >{user.email}</td>
                                    <td style={{ color: user.block && "red" }} >{user.mobilenumber || '-'}</td>
                                    <td style={{ color: user.block && "red" }} className="text-capitalize">{user.role}</td>
                                    <td  ><button type="button" onClick={() => { userBlock(user._id, user.block); console.log(user.block) }} className="btn block-user-btn"><i className="fa-solid fa-hand" style={{ color: "white" }}></i>{user.block ? ' UnBlock' : " Block"} </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default User;
