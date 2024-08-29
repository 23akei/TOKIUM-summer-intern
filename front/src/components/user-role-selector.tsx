import {useState, useEffect} from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import {api} from '../const';

interface UserRoleSelectorProps extends Omit<AutocompleteProps<string, false, false, false>, "options" | "renderInput" | "onChange"> {
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserRoleSelector({label, onChange, ...props}: UserRoleSelectorProps) {
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
  api.users.getUsers()
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch Users');
      else return response.json();
    }).then(users => {
      // from list of users get unique roles
      const roles = [...new Set(users.map(users => users.role)) as Set<string>];
      setRoles(roles);
    });
  }, []);

  return (
    <Autocomplete
      options={roles}
      getOptionLabel={(option) => option}
      style={{ width: 300 }}
      renderInput={(params) => <TextField
        {...params}
        label={label}
        onChange={onChange}
      />}
      {...props}
    />
  );
}
