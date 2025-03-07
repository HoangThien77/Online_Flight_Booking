import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  ReferenceField,
} from "react-admin";
import {
  Create,
  SimpleForm,
  ReferenceInput,
  NumberInput,
  TextInput,
  DateInput,
  SelectInput,
} from "react-admin";
import { Edit } from "react-admin";

export const PaymentList = (props) => (
  <List {...props} perPage={10}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="Payment ID" />
      <ReferenceField
        source="bookingId"
        reference="bookings"
        label="Booking ID"
      >
        <TextField source="id" />
      </ReferenceField>
      <NumberField source="amount" label="Amount" />
      <TextField source="paymentMethod" label="Payment Method" />
      <TextField source="status" label="Payment Status" />
      <DateField source="createdAt" label="Created At" />
      <DateField source="updatedAt" label="Updated At" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const PaymentCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="bookingId" reference="bookings" label="Booking">
        <SelectInput optionText="id" />
      </ReferenceInput>
      <NumberInput source="amount" label="Amount" />
      <TextInput source="paymentMethod" label="Payment Method" />
      <TextInput source="status" label="Payment Status" />
      <DateInput
        source="createdAt"
        label="Created At"
        defaultValue={new Date()}
      />
    </SimpleForm>
  </Create>
);

export const PaymentEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <ReferenceInput source="bookingId" reference="bookings" label="Booking">
        <SelectInput optionText="id" />
      </ReferenceInput>
      <NumberInput source="amount" label="Amount" />
      <TextInput source="paymentMethod" label="Payment Method" />
      <TextInput source="status" label="Payment Status" />
      <DateInput source="createdAt" label="Created At" />
      <DateInput
        source="updatedAt"
        label="Updated At"
        defaultValue={new Date()}
      />
    </SimpleForm>
  </Edit>
);
