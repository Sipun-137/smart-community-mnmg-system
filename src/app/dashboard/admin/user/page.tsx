"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Input,
  FormHelperText,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { AddUser, DeleteUser, GetUsers, UpdateUser } from "@/services/UserService";
import toast, { Toaster } from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "Resident" | "Admin" | "Security" | "Maintenance";
  apartmentNo: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Resident" as User["role"],
    apartmentNo: "",
    phone: "",
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setCurrentUser(user);
      setFormData({ ...user });
    } else {
      setCurrentUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "Resident",
        apartmentNo: "",
        phone: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    if (!id) return;
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  async function getUsers() {
    const data = await GetUsers();
    console.log(data);
    setUsers(data.users);
  }

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async () => {
    const res = await AddUser(formData);
    if (res.success) {
      toast.success(res.message);
      getUsers();
    } else {
      toast.error(res.message);
    }
    handleCloseDialog();
  };

  const handleUpdate = async () => {
    if (!currentUser) {
      return;
    }
    const res = await UpdateUser(formData, currentUser._id);
    if (res.success) {
      toast.success(res.message);
      getUsers();
    } else {
      toast.error(res.message);
    }
    handleCloseDialog();
  };

  const handleDelete=async ()=>{
    if(!deleteId){
      toast.error("id required");
      return;
    }
    const res=await DeleteUser(deleteId);
    if(res.suucess){
      toast.success(res.message);
      getUsers();
      handleCloseDeleteDialog();
    }else{
      toast.error(res.message);
      handleCloseDeleteDialog();
    }
  }

  return (
    <div>
      <Toaster position="bottom-right"/>
      <div className="flex justify-between items-center mb-4">
        <h1>User Management</h1>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add User
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Apartment</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.apartmentNo}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <Pencil />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(user._id)}
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          {/* name input control */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel htmlFor="name-input">Full Name</InputLabel>
            <Input
              id="name-input"
              aria-describedby="name-helper-text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
            />
            <FormHelperText id="email-helper-text">
              Please Provide Your full Name.
            </FormHelperText>
          </FormControl>

          {/* email input control */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel htmlFor="email-input">Email address</InputLabel>
            <Input
              id="email-input"
              type="email"
              aria-describedby="email-helper-text"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
            <FormHelperText id="email-helper-text">
              We will never share your email.
            </FormHelperText>
          </FormControl>
          {!currentUser ? (
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel htmlFor="password-input">password</InputLabel>
              <Input
                id="password-input"
                type="password"
                aria-describedby="password-helper-text"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                }}
              />
              <FormHelperText id="password-helper-text">
                create the default password for the new user(Ex:test123)
              </FormHelperText>
            </FormControl>
          ) : null}
          {/* password input control */}

          {/* role form Control */}
          <FormControl fullWidth sx={{ marginTop: 4 }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  role: e.target.value as User["role"],
                });
              }}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Resident">Resident</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel htmlFor="phone-input">Phone Number</InputLabel>
            <Input
              id="phone-input"
              aria-describedby="phone-helper-text"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
              }}
            />
            <FormHelperText id="phone-helper-text">
              we willnever share your phone number.
            </FormHelperText>
          </FormControl>
          {/* input field for the apartment number */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel htmlFor="phone-input">Apartment Number</InputLabel>
            <Input
              id="apartmentNo-input"
              aria-describedby="apartmentNo-helper-text"
              value={formData.apartmentNo}
              onChange={(e) => {
                setFormData({ ...formData, apartmentNo: e.target.value });
              }}
            />
            <FormHelperText id="apartmentNo-helper-text">
              Enter the apartmentNo number to be assigned. (Ex:A-1)
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={currentUser ? handleUpdate : handleSubmit}
          >
            {currentUser ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Do you want to Remove the Community User</DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={handleCloseDeleteDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
