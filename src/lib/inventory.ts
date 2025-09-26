"use server";
import { supabase } from "./supabaseClient";

// Récupérer l’inventaire d’un joueur
export async function getInventaire(userId: string) {
  const { data, error } = await supabase
    .from("inventaire")
    .select(
      "id, quantite, etat, objets(id, nom, description, image_url, rarete, type)"
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

// Ajouter un objet dans l’inventaire
export async function addObjet(
  userId: string,
  objetId: string,
  quantite: number = 1
) {
  const { data, error } = await supabase
    .from("inventaire")
    .insert([{ user_id: userId, objet_id: objetId, quantite }])
    .select();

  if (error) throw error;
  return data[0];
}

// Mettre à jour un objet (ex : état cassé, quantité)
export async function updateObjet(
  inventaireId: string,
  updates: Partial<{ quantite: number; etat: string }>
) {
  const { data, error } = await supabase
    .from("inventaire")
    .update(updates)
    .eq("id", inventaireId)
    .select();

  if (error) throw error;
  return data[0];
}

// Supprimer un objet
export async function removeObjet(inventaireId: string) {
  const { error } = await supabase
    .from("inventaire")
    .delete()
    .eq("id", inventaireId);
  if (error) throw error;
}
