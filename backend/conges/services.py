
import os
import logging
import requests

logger = logging.getLogger(__name__)


def envoyer_demande_vers_n8n(demande):
    """
    Transmet une demande de congé enregistrée à n8n.
    """

    webhook_url = os.getenv("N8N_WEBHOOK_URL")
    secret = os.getenv("N8N_WEBHOOK_SECRET")

    if not webhook_url or not secret:
        logger.error("Configuration du Webhook n8n manquante.")
        return

    payload = {
        "demande_id": demande.id,
        "employe_id": demande.employe_id,
        "employe_nom": (
            f"{demande.employe.nom} {demande.employe.prenom}"
        ),
        "type_conge": demande.type_conge.nom,
        "date_debut": demande.date_debut.isoformat(),
        "date_fin": demande.date_fin.isoformat(),
        "nombre_jours": demande.nombre_jours,
        "motif": demande.motif,
        "statut": demande.statut,
        "date_creation": demande.date_creation.isoformat(),
    }

    headers = {
        "X-N8N-API-KEY": secret,
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            webhook_url,
            json=payload,
            headers=headers,
            timeout=10,
        )

        response.raise_for_status()

        logger.info(
            "Demande %s transmise à n8n.",
            demande.id
        )

    except requests.RequestException:
        logger.exception(
            "Échec de transmission de la demande %s à n8n.",
            demande.id
        )
