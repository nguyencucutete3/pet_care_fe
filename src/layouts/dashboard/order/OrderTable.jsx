import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Typography,
    Modal,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Grid,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    RadioGroup,
    FormControlLabel,
    Radio,
    ButtonGroup
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import ButtonCustomize from "../../../components/Button/Button";

//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Axios
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

// -------------------------------STYLE MODAL----------------------
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function BasicTable() {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 5;

    const OPTION_VIEW_ORDER_BY_ID = 'view'

    const [option, setOption] = useState("");

    const [data, setData] = useState([]);
    const [id, setId] = useState("");
    const [orderDetail, setOrderDetail] = useState([]);
    const [status1, setStatus] = useState('');


    // --------------------- MODAL HANDLE -----------------------------

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // --------------------- HANDLE OPEN MODAL UPDATE -----------------------------
    const handleViewOrderDetail = async (id, option) => {
        try {
            console.log(id);
            const data = await axios.get(`http://localhost:3500/orderDetail/${id}`);
            if (data.error) {
                toast.error(data.error);
            } else {
                console.log(data.data);
                setOrderDetail(data.data)
            }
        } catch (err) {
            console.log(err);
        }
        console.log(88, orderDetail);
        setOption(option);
        handleOpen();
    };

    // --------------------- HANDLE UPDATE -----------------------------



    // --------------------- HANDLE DELETE -----------------------------
    const handleDelete = async (id) => {
        try {
            console.log(id);
            const data = await axios.delete(`http://localhost:3500/order/${id}`);
            if (data.error) {
                toast.error(data.error);
            } else {
                console.log(data);
                toast.success("Delete successfully");
            }
        } catch (err) {
            console.log(err);
        }
    };

    // ----------------------------------- API GET ALL USER --------------------------------
    async function loadAllOrder(page, limit) {
        try {
            const loadData = await axios.get(
                `http://localhost:3500/order?page=${page}&limit=${limit}`
            );
            if (loadData.error) {
                toast.error(loadData.error);
            } else {
                setData(loadData.data.docs);
                console.log(loadData.data.docs);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadAllOrder(DEFAULT_PAGE, DEFAULT_LIMIT);
    }, []);

    // ----------------------------------- HANDLE GET ORDER OF USER --------------------------------

    const [userId, setUserId] = useState('');

    const hanldeSearch = (e) => {
        setUserId(e.target.value)
    };

    const handleGetOrderByUserId = async () => {
        if (!userId == '') {
            getAllOrderByUserId();
        } else {
            loadAllOrder(DEFAULT_PAGE, DEFAULT_LIMIT);
        }

    }

    // ----------------------------------- GET ALL ORDER BY USER ID --------------------------------

    const getAllOrderByUserId = async () => {
        try {
            const loadData = await axios.get(
                `http://localhost:3500/order/${userId}`
            );
            if (loadData.error) {
                toast.error(loadData.error);
            } else {
                setData(loadData.data);
                // toast.success("Login successful");
                console.log(loadData.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // ---------------------------------------------------------------

    // ----------------------------------------------------------------

    const errorStyle = {
        color: "red",
        // backgroundColor: "DodgerBlue",
        paddingLeft: "15px",
        fontSize: "12px"
    };

    const statusList = [
        'Chờ xác nhận', 'Đang giao hàng', 'Đã nhận hàng'
    ]

    const hanldeClickChangeStatus = async (status, id) => {
        if (window.confirm('Bạn có muốn cập nhật trạng thái đơn hàng không ?') == true) {
            try {
                const loadData = await axios.put(
                    `http://localhost:3500/order/update-status/${id}`, {
                    orderStatus: status
                });
                if (loadData.error) {
                    toast.error(loadData.error);
                } else {
                    console.log(loadData.data);
                    loadAllOrder();
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <>
            <Grid
                spacing={2}
                container
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Grid item xs={6}>
                    <TextField
                        // required
                        fullWidth
                        label="Tìm kiếm chủ thú cưng theo ID"
                        margin="normal"
                        size="small"
                        onChange={hanldeSearch}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ButtonCustomize
                        onClick={handleGetOrderByUserId}
                        variant="contained"
                        // component={RouterLink}
                        nameButton="Tìm kiếm"
                    />
                </Grid>
            </Grid>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell children>ID</TableCell>
                                <TableCell align="right">Tên người dùng</TableCell>
                                <TableCell align="right">Ngày đặt hàng</TableCell>
                                <TableCell align="right">Tổng giá trị</TableCell>
                                <TableCell align="right">Trạng thái</TableCell>
                                <TableCell align="right">Chức năng</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data &&
                                data.map((value, index) => {
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="right">{value.userId !== null ? value.userId.fullname : ""}</TableCell>
                                            <TableCell align="right">{value.createdAt}</TableCell>
                                            <TableCell align="right">{value.totalPrice}</TableCell>
                                            <TableCell align="right">
                                                {value.status}
                                            </TableCell>
                                            <TableCell align="right">
                                                <ButtonGroup variant="contained" fullWidth>
                                                    <ButtonCustomize
                                                        onClick={(e) => handleViewOrderDetail(value._id, OPTION_VIEW_ORDER_BY_ID)}
                                                        variant="contained"
                                                        // component={RouterLink}
                                                        nameButton="xem chi tiết"
                                                        fullWidth
                                                    />
                                                    <ButtonCustomize
                                                        onClick={(e) => handleDelete(value._id)}
                                                        backgroundColor="red"
                                                        variant="contained"
                                                        // component={RouterLink}
                                                        nameButton="Xoá"
                                                        fullWidth
                                                    />
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        {option === "view" ? "Chi tiết đơn hàng" : "Đang cập nhật ......"}
                    </DialogTitle>
                    <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                        <InputLabel id="demo-select-small-label">Trạng thái</InputLabel>
                        <Select
                            label="Loại dịch vụ"
                        // value={selectedCategory}
                        // onChange={handleChangeCate}
                        >
                            {statusList.map((value, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={'dsadsadsa'}
                                        onClick={(e) => hanldeClickChangeStatus(value, orderDetail[0].orderId)}
                                    >
                                        {value}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >

                            <Table sx={{ width: '100%' }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell children>STT</TableCell>
                                        <TableCell align="right">Mã đơn hàng</TableCell>
                                        <TableCell align="right">Tên sản phẩm</TableCell>
                                        <TableCell align="right">Số lượng</TableCell>
                                        <TableCell align="right">Giá</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetail &&
                                        orderDetail.map((value, index) => {
                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="right">{value.orderId}</TableCell>
                                                    <TableCell align="right">{value.productId.productName}</TableCell>
                                                    <TableCell align="right">{value.quantity}</TableCell>
                                                    <TableCell align="right">{value.productId.price}</TableCell>
                                                    <TableCell align="right"></TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>

                        </Grid>
                    </DialogContent>
                    {/* 
                    <DialogActions>
                        <Button
                            variant="contained"
                            margin="normal"
                            color="primary"
                        // onClick={handleUpdate}
                        >
                            Cập nhật thông tin
                        </Button>
                    </DialogActions> */}
                </Box>
            </Modal>
        </>
    );
}
