import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Create,
  SimpleForm,
  TextInput,
  Edit,
  DateField,
  EmailField,
  PasswordInput,
  ImageField,
  ImageInput,
  SelectInput,
} from "react-admin";

// UserList - Display User list
export const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick={false}>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="phoneNumber" />
      <TextField source="address" />
      <TextField source="provider" />
      <TextField source="providerAccountId" />
      <TextField source="image" />
      <TextField source="role" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// UserCreate - Create new User
export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" />
      <TextInput source="phoneNumber" />
      <PasswordInput source="password" />
      <TextInput source="address" />
      <TextInput source="provider" />
      <TextInput source="providerAccountId" />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
      <SelectInput
        source="role"
        choices={[
          { id: "USER", name: "User" },
          { id: "ADMIN", name: "Admin" },
        ]}
        defaultValue="USER"
      />
    </SimpleForm>
  </Create>
);

// UserEdit - Edit User
export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" />
      <TextInput source="phoneNumber" />
      <PasswordInput source="password" />
      <TextInput source="address" />
      <TextInput source="provider" />
      <TextInput source="providerAccountId" />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
      <SelectInput
        source="role"
        choices={[
          { id: "USER", name: "User" },
          { id: "ADMIN", name: "Admin" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
