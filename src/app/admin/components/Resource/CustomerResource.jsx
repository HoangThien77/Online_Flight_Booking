import React from "react";
import { Create, SimpleForm, TextInput, DateInput, Edit } from "react-admin";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  DeleteButton,
  EditButton,
} from "react-admin";

export const CustomerList = (props) => (
  <List>
    <Datagrid rowClick={false}>
      <TextField source="id" label="ID" />
      <TextField source="firstName" label="First Name" />
      <TextField source="lastName" label="Last Name" />
      <DateField source="dateOfBirth" label="Date of Birth" />
      <TextField source="gender" label="Gender" />
      <TextField source="nationality" label="Nationality" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const CustomerCreate = (props) => (
  <Create title="Tạo mới khách hàng" {...props}>
    <SimpleForm>
      <TextInput source="firstName" label="Họ" />
      <TextInput source="lastName" label="Tên" />
      <DateInput source="dateOfBirth" label="Ngày sinh" />
      <TextInput source="gender" label="Giới tính" />
      <TextInput source="nationality" label="Quốc tịch" />
    </SimpleForm>
  </Create>
);

export const CustomerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" InputProps={{ disabled: true }} />
      <TextInput source="firstName" label="First Name" />
      <TextInput source="lastName" label="Last Name" />
      <DateInput source="dateOfBirth" label="Date of Birth" />
      <TextInput source="gender" label="Gender" />
      <TextInput source="nationality" label="Nationality" />
    </SimpleForm>
  </Edit>
);
