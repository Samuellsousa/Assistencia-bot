export async function listarChamados() {
  try {
    const response = await fetch('http://localhost:3000/chamados');
    
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao buscar chamados: ${response.statusText}`);
    }

    // Retorna os dados em formato JSON
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    // Retorna um array vazio ou pode retornar um valor de fallback
    return [];
  }
}
