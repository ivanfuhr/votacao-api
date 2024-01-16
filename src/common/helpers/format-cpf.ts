export function FormatCpf(cpf: string) {
  const cleanCPF = cpf.replace(/[^\d]+/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
