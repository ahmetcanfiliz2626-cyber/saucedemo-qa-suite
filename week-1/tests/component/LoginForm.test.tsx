import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../../src/components/LoginForm';

describe('LoginForm', () => {
  it('username ve password input ile login butonu render eder', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('forma girilen değerleri onSubmit ile iletir', () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'standard_user' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret_sauce' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith('standard_user', 'secret_sauce');
  });

  it('errorMessage prop verildiğinde hata mesajını gösterir', () => {
    render(<LoginForm onSubmit={vi.fn()} errorMessage="Epic sadge" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Epic sadge');
  });

  it('errorMessage verilmediğinde hata alanı render edilmez', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  })

  it('boş alanlarla submit edildiğinde onSubmit boş string ile çağrılır', () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(onSubmit).toHaveBeenCalledWith('', '');
  });
});
